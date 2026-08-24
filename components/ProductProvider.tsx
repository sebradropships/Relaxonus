"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import { ADDED_MS, SET_FRAME, VARIANTS, type VariantKey } from "@/lib/product";

interface ProductState {
  /** Currently selected purchase option. */
  variant: VariantKey;
  /** Index of the visible gallery frame, 0–4. */
  image: number;
  /** Number of massagers in the cart. */
  cart: number;
  /** True for a moment after adding, so the CTA can confirm. */
  added: boolean;
  /** Attached to the hero so the sticky bar knows when it has scrolled past. */
  heroRef: RefObject<HTMLElement | null>;
  selectVariant: (variant: VariantKey) => void;
  selectImage: (index: number) => void;
  addToCart: () => void;
  /** Select an option from further down the page, then return to the buy box. */
  chooseAndScrollUp: (variant: VariantKey) => void;
}

const ProductContext = createContext<ProductState | null>(null);

export function useProduct(): ProductState {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used inside <ProductProvider>");
  }
  return context;
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<VariantKey>("blue");
  const [image, setImage] = useState(0);
  const [cart, setCart] = useState(0);
  const [added, setAdded] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const heroRef = useRef<HTMLElement | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const selectVariant = useCallback((next: VariantKey) => {
    setVariant(next);
    // The set has a dedicated hero frame; single colours reset to the first.
    setImage(next === "set" ? SET_FRAME : 0);
  }, []);

  const selectImage = useCallback((index: number) => setImage(index), []);

  const addToCart = useCallback(() => {
    const selected = VARIANTS[variant];
    // One line item per add. The set is a single Shopify variant that happens
    // to contain two massagers — it is not two units in the cart.
    const next = cart + 1;

    setCart(next);
    setAnnouncement(
      `${selected.name} added to cart. ${next} ${next === 1 ? "item" : "items"} in cart.`,
    );

    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), ADDED_MS);
  }, [variant, cart]);

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
      cart,
      added,
      heroRef,
      selectVariant,
      selectImage,
      addToCart,
      chooseAndScrollUp,
    }),
    [variant, image, cart, added, selectVariant, selectImage, addToCart, chooseAndScrollUp],
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
