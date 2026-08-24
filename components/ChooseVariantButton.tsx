"use client";

import { useProduct } from "@/components/ProductProvider";
import type { VariantKey } from "@/lib/product";

/**
 * Shop-grid button: selects the option and takes the customer back up to the
 * buy box, where the price and add-to-cart live.
 */
export function ChooseVariantButton({
  variant,
  label,
  className,
}: {
  variant: VariantKey;
  label: string;
  className?: string;
}) {
  const { chooseAndScrollUp } = useProduct();

  return (
    <button type="button" className={className} onClick={() => chooseAndScrollUp(variant)}>
      {label}
    </button>
  );
}
