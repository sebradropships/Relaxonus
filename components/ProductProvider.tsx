"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useOptimistic,
  useState,
  useTransition,
  type ReactNode,
  type RefObject,
} from "react";

import { addToCartAction, getCartAction } from "@/app/actions/cart";
import { ADDED_MS, VARIANTS, type VariantKey } from "@/lib/product";
import { formatMoney } from "@/lib/money";
import type { CartSummary, ProductCommerce } from "@/lib/shopify/types";

interface ProductState {
  /** Currently selected purchase option. */
  variant: VariantKey;
  /** Index of the visible gallery frame within the variant's frame list. */
  image: number;
  /** Attached to the hero so the sticky bar knows when it has scrolled past. */
  heroRef: RefObject<HTMLElement | null>;

  /** Units in the Shopify cart. */
  cart: number;
  /** Shopify-hosted checkout, once there is something to check out with. */
  checkoutUrl: string | null;
  /** True for a moment after a successful add, so the CTA can confirm. */
  added: boolean;
  /** True while an add is in flight. */
  pending: boolean;
  /** Set when Shopify refused the add. */
  error: string | null;

  /** Live Shopify price where available, otherwise the committed price. */
  priceFor: (key: VariantKey) => string;
  availableFor: (key: VariantKey) => boolean;

  selectVariant: (variant: VariantKey) => void;
  selectImage: (index: number) => void;
  addToCart: () => void;
  /** Select an option from further down the page, then return to the buy box. */
  chooseAndScrollUp: (variant: VariantKey) => void;
}

const ProductContext = createContext<ProductState | null>(null);

export function useProduct(): ProductState {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProduct must be used inside <ProductProvider>");
  return context;
}

export function ProductProvider({
  children,
  commerce,
}: {
  children: ReactNode;
  commerce: ProductCommerce;
}) {
  const [variant, setVariant] = useState<VariantKey>("blue");
  const [image, setImage] = useState(0);
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [pending, startTransition] = useTransition();

  const heroRef = useRef<HTMLElement | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);

  /* The badge moves on click, not on response. React discards the overlay when
     the transition that dispatched it ends — on success the real summary has
     already landed inside that same transition, so there is no flicker back to
     the old count; on failure the count simply reverts. */
  const [cartCount, addOptimisticUnits] = useOptimistic(
    summary?.totalQuantity ?? 0,
    (current: number, units: number) => current + units,
  );

  /* A returning shopper still holds their cart cookie; pick the cart back up. */
  useEffect(() => {
    let cancelled = false;
    getCartAction()
      .then((cart) => {
        // May only fill an empty slot. This response was issued before any add,
        // so if an add has already written a summary, ours is the older value
        // and must not replace it.
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
    // Every option leads with its own photograph, so always show frame 0.
    setImage(0);
    setError(null);
    // ADDED ✓ belongs to the option that was added, not to this one. Without
    // this, switching option within ADDED_MS leaves the CTA confirming a
    // product the shopper is no longer looking at.
    if (addedTimer.current) clearTimeout(addedTimer.current);
    setAdded(false);
  }, []);

  const selectImage = useCallback((index: number) => setImage(index), []);

  const priceFor = useCallback(
    (key: VariantKey) => {
      const live = commerce.variants?.[key];
      return live ? formatMoney(live.price) : VARIANTS[key].price;
    },
    [commerce],
  );

  const availableFor = useCallback(
    (key: VariantKey) => commerce.variants?.[key].availableForSale ?? true,
    [commerce],
  );

  const addToCart = useCallback(() => {
    // Synchronous guard. `pending` only becomes true once React commits, so a
    // second click dispatched in the same tick can otherwise get through — and
    // with no cart cookie yet, both clicks take the cartCreate branch and one
    // of the two carts is orphaned.
    if (inFlight.current) return;
    inFlight.current = true;

    const selected = VARIANTS[variant];
    setError(null);

    startTransition(async () => {
      addOptimisticUnits(1);

      try {
        const result = await addToCartAction(variant);

        if (!result.ok || !result.cart) {
          // CartError renders this inside role="alert", which announces itself.
          // Writing the same string to the page-level status region as well
          // makes screen readers say it twice, once assertively and once politely.
          setError(result.error ?? "Could not add to cart.");
          return;
        }

        setSummary(result.cart);
        setAdded(true);
        setAnnouncement(
          `${selected.name} added to cart. ${result.cart.totalQuantity} ` +
            `${result.cart.totalQuantity === 1 ? "item" : "items"} in cart.`,
        );

        if (addedTimer.current) clearTimeout(addedTimer.current);
        addedTimer.current = setTimeout(() => setAdded(false), ADDED_MS);
      } catch {
        // The action itself never throws, but its transport can — offline, a
        // 502 mid-deploy, a stale action id after a redeploy. There is no error
        // boundary in this app, so an unhandled rejection here would blank the
        // entire storefront.
        setError("Could not reach the store. Please try again.");
      } finally {
        inFlight.current = false;
      }
    });
  }, [variant, addOptimisticUnits]);

  const chooseAndScrollUp = useCallback(
    (next: VariantKey) => {
      selectVariant(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [selectVariant],
  );

  const value = useMemo<ProductState>(
    () => ({
      variant,
      image,
      heroRef,
      cart: cartCount,
      checkoutUrl: summary?.checkoutUrl ?? null,
      added,
      pending,
      error,
      priceFor,
      availableFor,
      selectVariant,
      selectImage,
      addToCart,
      chooseAndScrollUp,
    }),
    [
      variant,
      image,
      cartCount,
      summary,
      added,
      pending,
      error,
      priceFor,
      availableFor,
      selectVariant,
      selectImage,
      addToCart,
      chooseAndScrollUp,
    ],
  );

  return (
    <ProductContext.Provider value={value}>
      {children}
      {/* One page-level live region announces cart changes to screen readers. */}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </ProductContext.Provider>
  );
}
