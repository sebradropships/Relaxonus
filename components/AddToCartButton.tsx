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
      onClick={() => {
        if (pending || soldOut) return;
        addToCart();
      }}
      /* Sold out is permanent, so native `disabled` is right for it. Pending is
         transient, and the browser blurs a focused element the moment it becomes
         disabled — which throws keyboard focus to <body> mid-add and makes
         aria-busy unannounceable, since it is attached to a control the user is
         no longer on. aria-disabled keeps the control focusable; the guard above
         and the inFlight ref in ProductProvider are what actually block clicks. */
      disabled={soldOut}
      aria-disabled={pending || undefined}
      aria-busy={pending}
      aria-describedby={error ? "cart-error" : undefined}
    >
      {label}
    </button>
  );
}
