"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

  /* A returning shopper still holds their cart cookie; pick the cart back up. */
  useEffect(() => {
    let cancelled = false;
    getCartAction()
      .then((cart) => {
        if (!cancelled && cart) setSummary(cart);
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
    const selected = VARIANTS[variant];
    setError(null);

    startTransition(async () => {
      const result = await addToCartAction(variant);

      if (!result.ok || !result.cart) {
        const message = result.error ?? "Could not add to cart.";
        setError(message);
        setAnnouncement(message);
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
    });
  }, [variant]);

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
      cart: summary?.totalQuantity ?? 0,
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
