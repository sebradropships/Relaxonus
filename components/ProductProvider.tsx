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
  type RefObject,
} from "react";

import { addToCartAction, getCartAction } from "@/app/actions/cart";
import { ADDED_MS, DEFAULT_TIER, MAX_QUANTITY, VARIANTS, type VariantKey } from "@/lib/product";
import { formatMoney } from "@/lib/money";
import type { CartSummary, ProductCommerce } from "@/lib/shopify/types";

interface ProductState {
  /** Selected tier. The tier IS the Shopify variant — one control, one state. */
  variant: VariantKey;
  image: number;
  /** Units of the selected tier to add. Clamped 1–MAX_QUANTITY. */
  quantity: number;
  setQuantity: (next: number) => void;
  heroRef: RefObject<HTMLElement | null>;

  cart: number;
  checkoutUrl: string | null;
  added: boolean;
  pending: boolean;
  error: string | null;

  /** Live Shopify price where available, otherwise the committed price. */
  priceFor: (key: VariantKey) => string;
  /** Genuine reference price, or null. Only the Duo has one. */
  compareAtFor: (key: VariantKey) => string | null;
  availableFor: (key: VariantKey) => boolean;

  selectVariant: (variant: VariantKey) => void;
  selectImage: (index: number) => void;
  addToCart: () => void;
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
  const [variant, setVariant] = useState<VariantKey>(DEFAULT_TIER);
  const [image, setImage] = useState(0);
  const [quantity, setQuantityState] = useState(1);
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [pending, startTransition] = useTransition();

  const heroRef = useRef<HTMLElement | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);

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
  }, [variant, quantity, addOptimisticUnits]);

  const value = useMemo<ProductState>(
    () => ({
      variant,
      image,
      quantity,
      setQuantity,
      heroRef,
      cart: cartCount,
      checkoutUrl: summary?.checkoutUrl ?? null,
      added,
      pending,
      error,
      priceFor,
      compareAtFor,
      availableFor,
      selectVariant,
      selectImage,
      addToCart,
    }),
    [
      variant, image, quantity, setQuantity, cartCount, summary, added, pending, error,
      priceFor, compareAtFor, availableFor, selectVariant, selectImage, addToCart,
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
