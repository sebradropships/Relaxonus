"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useOptimistic,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";

import {
  addToCartAction,
  getCartAction,
  removeLineAction,
  setDiscountCodesAction,
  updateLineQuantityAction,
} from "@/app/actions/cart";
import { breakFor } from "@/lib/campaign";
import { ADDED_MS, DEFAULT_TIER, MAX_QUANTITY, VARIANTS, type VariantKey } from "@/lib/product";
import { formatMoney } from "@/lib/money";
import type { CartLine, CartSummary, Money, ProductCommerce } from "@/lib/shopify/types";

interface ProductState {
  /** Selected tier. The tier IS the Shopify variant — one control, one state. */
  variant: VariantKey;
  image: number;
  /** Units of the selected tier to add. Clamped 1–MAX_QUANTITY. */
  quantity: number;
  setQuantity: (next: number) => void;
  /**
   * Attach to every element that contains a real Add-to-cart button. The
   * sticky mobile bar hides while any of them is on screen, so it can never
   * duplicate a CTA the shopper is already looking at.
   */
  registerBuyZone: (node: HTMLElement | null) => (() => void) | void;
  buyZoneVisible: boolean;

  cart: number;
  checkoutUrl: string | null;
  added: boolean;
  pending: boolean;
  error: string | null;

  /** Cart drawer. */
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  lines: CartLine[];
  subtotal: Money | null;
  /** Line id -> true while that line's own update/remove request is in flight. */
  lineBusy: Record<string, boolean>;
  lineError: string | null;
  setLineQuantity: (lineId: string, quantity: number) => void;
  removeCartLine: (lineId: string) => void;

  /** Live Shopify price where available, otherwise the committed price. */
  priceFor: (key: VariantKey) => string;
  /** Genuine reference price, or null. */
  compareAtFor: (key: VariantKey) => string | null;
  availableFor: (key: VariantKey) => boolean;

  /** Numeric forms, for arithmetic the page has to show as a claim. */
  amountFor: (key: VariantKey) => number;
  /**
   * Whole-percent reduction against a genuine compare-at, or null when there
   * is no real discount. Derived from live Shopify money, never hardcoded —
   * so the page cannot advertise a sale that is not actually on.
   */
  discountPercentFor: (key: VariantKey) => number | null;
  /** Live units in stock, or null when inventory cannot be read. */
  stockFor: (key: VariantKey) => number | null;

  selectVariant: (variant: VariantKey) => void;
  selectImage: (index: number) => void;
  addToCart: () => void;
  /** Adds the selection, then navigates straight to Shopify checkout. */
  buyNow: () => void;
}

const ProductContext = createContext<ProductState | null>(null);

export function useProduct(): ProductState {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProduct must be used inside <ProductProvider>");
  return context;
}

/**
 * Marks the element it is attached to as containing a real Add-to-cart
 * button, so the sticky mobile bar can stand down while it is on screen.
 *
 * Registration happens in an effect rather than from the ref callback itself:
 * child effects run before the parent's, so the provider's first measurement
 * already sees every zone on the page.
 */
export function useBuyZone() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { registerBuyZone } = useProduct();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return registerBuyZone(node) ?? undefined;
  }, [registerBuyZone]);

  return ref;
}

export function ProductProvider({
  children,
  commerce,
}: {
  children: ReactNode;
  commerce: ProductCommerce;
}) {
  const [variant, setVariant] = useState<VariantKey>(DEFAULT_TIER);
  const [image, setImage] = useState(0);
  const [quantity, setQuantityState] = useState(1);
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [pending, startTransition] = useTransition();

  const [cartOpen, setCartOpen] = useState(false);
  const [lineBusy, setLineBusy] = useState<Record<string, boolean>>({});
  const [lineError, setLineError] = useState<string | null>(null);
  const [, startLineTransition] = useTransition();

  const [buyZoneVisible, setBuyZoneVisible] = useState(false);
  const zoneNodes = useRef<Set<HTMLElement>>(new Set());
  const recompute = useRef<() => void>(() => {});

  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);
  /** Synchronous guard per line — `lineBusy` only flips after React commits. */
  const lineInFlight = useRef<Set<string>>(new Set());

  /* The badge moves on click, not on response. */
  const [cartCount, addOptimisticUnits] = useOptimistic(
    summary?.totalQuantity ?? 0,
    (current: number, units: number) => current + units,
  );

  useEffect(() => {
    let cancelled = false;
    getCartAction()
      .then((cart) => {
        // May only fill an empty slot — an add that already landed is newer.
        if (!cancelled && cart) setSummary((prev) => prev ?? cart);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const selectVariant = useCallback((next: VariantKey) => {
    setVariant(next);
    setImage(0);
    setError(null);
    // ADDED belongs to the tier that was added, not to this one.
    if (addedTimer.current) clearTimeout(addedTimer.current);
    setAdded(false);
  }, []);

  const selectImage = useCallback((index: number) => setImage(index), []);

  /*
    Is any real Add-to-cart button on screen right now?

    Measured against the viewport on scroll rather than with an
    IntersectionObserver: the insets below have to match the sticky bar's own
    height so the bar never appears while a CTA is merely sitting behind it,
    and a plain rect comparison makes that relationship legible — and
    testable — instead of hiding it in a rootMargin string.
  */
  useEffect(() => {
    /* Deliberately not rAF-throttled. Two getBoundingClientRect reads is far
       cheaper than the bookkeeping, and a rAF callback never runs while the
       tab is not compositing — which would strand the bar in whatever state
       it held when the page was last painted. */
    const measure = () => {
      const height = window.innerHeight;
      let onScreen = false;
      for (const node of zoneNodes.current) {
        const rect = node.getBoundingClientRect();
        // 56px clears the sticky header, 96px the sticky purchase bar.
        if (rect.bottom > 56 && rect.top < height - 96) {
          onScreen = true;
          break;
        }
      }
      setBuyZoneVisible(onScreen);
    };

    recompute.current = measure;
    measure();

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    // Late-loading images reflow the page under a stationary scroll position.
    const resize = new ResizeObserver(measure);
    resize.observe(document.documentElement);

    return () => {
      recompute.current = () => {};
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      resize.disconnect();
    };
  }, []);

  const registerBuyZone = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    zoneNodes.current.add(node);
    recompute.current();

    return () => {
      zoneNodes.current.delete(node);
      recompute.current();
    };
  }, []);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const setLineQuantity = useCallback((lineId: string, quantity: number) => {
    if (lineInFlight.current.has(lineId)) return;
    lineInFlight.current.add(lineId);
    setLineBusy((busy) => ({ ...busy, [lineId]: true }));
    setLineError(null);

    startLineTransition(async () => {
      try {
        const result = await updateLineQuantityAction(lineId, quantity);
        // Resync to whatever Shopify actually accepted, even on failure — a
        // stale quantity the request never landed is worse than showing the
        // real one alongside the error.
        if (result.cart) setSummary(result.cart);
        if (!result.ok) setLineError(result.error ?? "Could not update your cart.");
      } catch {
        setLineError("Could not reach the store. Please try again.");
      } finally {
        lineInFlight.current.delete(lineId);
        setLineBusy((busy) => {
          const next = { ...busy };
          delete next[lineId];
          return next;
        });
      }
    });
  }, []);

  const removeCartLine = useCallback((lineId: string) => {
    if (lineInFlight.current.has(lineId)) return;
    lineInFlight.current.add(lineId);
    setLineBusy((busy) => ({ ...busy, [lineId]: true }));
    setLineError(null);

    startLineTransition(async () => {
      try {
        const result = await removeLineAction(lineId);
        if (result.cart) setSummary(result.cart);
        if (!result.ok) setLineError(result.error ?? "Could not remove that item.");
      } catch {
        setLineError("Could not reach the store. Please try again.");
      } finally {
        lineInFlight.current.delete(lineId);
        setLineBusy((busy) => {
          const next = { ...busy };
          delete next[lineId];
          return next;
        });
      }
    });
  }, []);

  /* Clamped here as well as on the server, so the UI can never present a
     value the action would silently rewrite. */
  const setQuantity = useCallback((next: number) => {
    setQuantityState(Math.min(Math.max(Math.floor(next) || 1, 1), MAX_QUANTITY));
  }, []);

  const priceFor = useCallback(
    (key: VariantKey) => {
      const live = commerce.variants?.[key];
      return live ? formatMoney(live.price) : VARIANTS[key].price;
    },
    [commerce],
  );

  const compareAtFor = useCallback(
    (key: VariantKey) => {
      const live = commerce.variants?.[key];
      if (live) return live.compareAtPrice ? formatMoney(live.compareAtPrice) : null;
      return VARIANTS[key].compareAt ?? null;
    },
    [commerce],
  );

  const availableFor = useCallback(
    (key: VariantKey) => commerce.variants?.[key].availableForSale ?? true,
    [commerce],
  );

  /* The committed fallbacks in lib/product.ts are the REGULAR prices and are
     deliberately left that way: if Shopify cannot be reached mid-promotion the
     page quietly shows regular pricing rather than a discount it could not
     verify. Overstating the price is recoverable; understating it is not. */
  const parseMoney = (text: string) => Number.parseFloat(text.replace(/[^0-9.]/g, ""));

  const amountFor = useCallback(
    (key: VariantKey) => {
      const live = commerce.variants?.[key];
      return live ? Number.parseFloat(live.price.amount) : parseMoney(VARIANTS[key].price);
    },
    [commerce],
  );

  const compareAmountFor = useCallback(
    (key: VariantKey) => {
      const live = commerce.variants?.[key];
      if (live) {
        return live.compareAtPrice ? Number.parseFloat(live.compareAtPrice.amount) : null;
      }
      const committed = VARIANTS[key].compareAt;
      return committed ? parseMoney(committed) : null;
    },
    [commerce],
  );

  const discountPercentFor = useCallback(
    (key: VariantKey) => {
      const now = amountFor(key);
      const was = compareAmountFor(key);
      // A compare-at at or below the price is not a reduction, whatever the
      // merchant typed into Shopify.
      if (was === null || !Number.isFinite(now) || was <= now) return null;
      return Math.round(((was - now) / was) * 100);
    },
    [amountFor, compareAmountFor],
  );

  const stockFor = useCallback(
    (key: VariantKey) => commerce.inventory?.[key] ?? null,
    [commerce],
  );

  const addToCart = useCallback(() => {
    // Synchronous guard: `pending` only flips after React commits, so a
    // same-tick second click would otherwise create a second cart.
    if (inFlight.current) return;
    inFlight.current = true;

    const selected = VARIANTS[variant];
    setError(null);

    startTransition(async () => {
      // Read once: the badge must reflect what this click actually sent, even
      // if the stepper moves while the request is in flight.
      const sending = quantity;
      addOptimisticUnits(sending);

      try {
        const result = await addToCartAction(variant, sending);

        if (!result.ok || !result.cart) {
          // CartError carries role="alert" and announces itself; writing the
          // same string to the status region too would double-announce it.
          setError(result.error ?? "Could not add to cart.");
          return;
        }

        setSummary(result.cart);
        setAdded(true);
        openCart();
        setAnnouncement(
          `${sending} × ${selected.name} added to cart. ${result.cart.totalQuantity} ` +
            `${result.cart.totalQuantity === 1 ? "item" : "items"} in cart.`,
        );

        if (addedTimer.current) clearTimeout(addedTimer.current);
        addedTimer.current = setTimeout(() => setAdded(false), ADDED_MS);
      } catch {
        // The action never throws, but its transport can. There is no error
        // boundary here, so an unhandled rejection would blank the storefront.
        setError("Could not reach the store. Please try again.");
      } finally {
        inFlight.current = false;
      }
    });
  }, [variant, quantity, addOptimisticUnits, openCart]);

  /**
   * Adds the selection and goes straight to Shopify checkout.
   *
   * Navigates to the checkout URL that THIS add returned rather than to a
   * cached one: on a first click no cart exists yet, and a stale URL would
   * send the shopper to a checkout that predates the item they just chose.
   */
  const buyNow = useCallback(() => {
    if (inFlight.current) return;
    inFlight.current = true;
    setError(null);

    startTransition(async () => {
      const sending = quantity;
      try {
        const result = await addToCartAction(variant, sending);

        if (!result.ok || !result.cart) {
          setError(result.error ?? "Could not start checkout.");
          return;
        }

        const tier = breakFor(sending);
        if (tier) {
          /* Volume discount rides along, but a rejected code must not block
             the sale: on failure the shopper still reaches checkout, just at
             the undiscounted price the cart actually holds. */
          const discounted = await setDiscountCodesAction([tier.code]);
          if (discounted.cart) setSummary(discounted.cart);
          if (discounted.cart?.checkoutUrl) {
            window.location.assign(discounted.cart.checkoutUrl);
            return;
          }
        }

        setSummary(result.cart);
        window.location.assign(result.cart.checkoutUrl);
      } catch {
        setError("Could not reach the store. Please try again.");
      } finally {
        inFlight.current = false;
      }
    });
  }, [variant, quantity]);

  /**
   * Keeps the cart's volume discount in step with what is actually in it.
   *
   * Runs off the cart's own total quantity, not the stepper, so it is correct
   * however the cart got there — a second add, a line edit, a removal. Only
   * fires when the intended code differs from the one already applied, so it
   * does not loop on its own result.
   */
  const syncedCodes = useRef<string>("");
  useEffect(() => {
    if (!summary) return;

    const tier = breakFor(summary.totalQuantity);
    const want = tier ? tier.code : "";
    const have = summary.discountCodes
      .filter((d) => d.applicable)
      .map((d) => d.code)
      .join(",");

    if (want === have || syncedCodes.current === want) return;
    syncedCodes.current = want;

    startLineTransition(async () => {
      try {
        const result = await setDiscountCodesAction(want ? [want] : []);
        if (result.cart) setSummary(result.cart);
      } catch {
        /* Leave the cart as-is: an unapplied volume discount is a smaller
           problem than a cart that stops responding. */
      }
    });
  }, [summary]);

  const value = useMemo<ProductState>(
    () => ({
      variant,
      image,
      quantity,
      setQuantity,
      registerBuyZone,
      buyZoneVisible,
      cart: cartCount,
      checkoutUrl: summary?.checkoutUrl ?? null,
      added,
      pending,
      error,
      cartOpen,
      openCart,
      closeCart,
      lines: summary?.lines ?? [],
      subtotal: summary?.subtotal ?? null,
      lineBusy,
      lineError,
      setLineQuantity,
      removeCartLine,
      priceFor,
      compareAtFor,
      amountFor,
      discountPercentFor,
      stockFor,
      availableFor,
      selectVariant,
      selectImage,
      addToCart,
      buyNow,
    }),
    [
      variant, image, quantity, setQuantity, registerBuyZone, buyZoneVisible,
      cartCount, summary, added, pending, error,
      cartOpen, openCart, closeCart, lineBusy, lineError, setLineQuantity, removeCartLine,
      priceFor, compareAtFor, availableFor, amountFor, discountPercentFor, stockFor,
      selectVariant, selectImage, addToCart, buyNow,
    ],
  );

  return (
    <ProductContext.Provider value={value}>
      {children}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </ProductContext.Provider>
  );
}
