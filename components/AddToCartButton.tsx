"use client";

import { useProduct } from "@/components/ProductProvider";
import { CTA_ADDED, CTA_LABEL } from "@/lib/product";

export function AddToCartButton({ className }: { className?: string }) {
  const { added, addToCart } = useProduct();

  return (
    <button type="button" className={className} onClick={addToCart}>
      {added ? CTA_ADDED : CTA_LABEL}
    </button>
  );
}
