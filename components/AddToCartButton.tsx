"use client";

import { useProduct } from "@/components/ProductProvider";
import { CTA_ADDED, CTA_LABEL } from "@/lib/product";

export function AddToCartButton({ className }: { className?: string }) {
  const { added, pending, error, addToCart, variant, availableFor } = useProduct();

  const soldOut = !availableFor(variant);

  const label = soldOut ? "SOLD OUT" : pending ? "ADDING…" : added ? CTA_ADDED : CTA_LABEL;

  return (
    <button
      type="button"
      className={className}
      onClick={addToCart}
      disabled={pending || soldOut}
      aria-busy={pending}
      aria-describedby={error ? "cart-error" : undefined}
    >
      {label}
    </button>
  );
}
