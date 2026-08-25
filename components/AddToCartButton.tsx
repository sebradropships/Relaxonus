"use client";

import { useProduct } from "@/components/ProductProvider";
import { VARIANTS } from "@/lib/product";

/**
 * The price in the label always mirrors the live tier selection. No price
 * anywhere on this page may ever contradict what the buyer is about to pay.
 */
export function AddToCartButton({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { added, pending, error, addToCart, variant, availableFor, priceFor, cart } = useProduct();

  const soldOut = !availableFor(variant);
  const noun = VARIANTS[variant].units === 2 ? "THE DUO" : "ONE";

  const label = soldOut
    ? "SOLD OUT"
    : pending
      ? "ADDING…"
      : added
        ? "ADDED ✓"
        : compact
          ? `ADD — ${priceFor(variant)}`
          : `ADD ${noun} — ${priceFor(variant)}`;

  return (
    <button
      type="button"
      onClick={() => {
        if (pending || soldOut) return;
        addToCart();
      }}
      /* Sold out is permanent, so native `disabled` fits. Pending is transient,
         and disabling blurs the focused element mid-add — which throws keyboard
         focus to <body> and makes aria-busy unannounceable. */
      disabled={soldOut}
      aria-disabled={pending || undefined}
      aria-busy={pending}
      aria-describedby={error ? "cart-error" : undefined}
      data-in-cart={cart > 0 ? "true" : "false"}
      className={[
        "sp-cta sp-squeeze sp-display w-full border-[3px] border-sp-black bg-sp-bubblegum text-sp-ink",
        "transition-colors disabled:cursor-not-allowed disabled:bg-sp-rule disabled:text-sp-paper",
        "aria-disabled:cursor-wait",
        compact ? "px-5 py-3 text-sm" : "px-6 py-5 text-xl",
        className,
      ].join(" ")}
    >
      <span aria-hidden="true">🛒 </span>
      {label}
    </button>
  );
}

/** Inline failure message. Rendered twice; only the hero copy announces. */
export function CartError({ decorative = false }: { decorative?: boolean }) {
  const { error } = useProduct();
  if (!error) return null;

  const classes = "border-[3px] border-sp-no bg-sp-carbon px-4 py-3 text-[15px] text-sp-paper";

  if (decorative) return <p className={classes}>{error}</p>;

  return (
    <p id="cart-error" role="alert" className={classes}>
      {error}
    </p>
  );
}

/** Only rendered once there is a cart — an empty checkout is a dead end. */
export function CheckoutLink({ className = "" }: { className?: string }) {
  const { checkoutUrl, cart } = useProduct();
  if (!checkoutUrl || cart === 0) return null;

  return (
    <a
      href={checkoutUrl}
      className={`sp-display sp-squeeze block w-full border-[3px] border-sp-chlorine bg-sp-carbon px-6 py-4 text-center text-base text-sp-chlorine transition-colors hover:bg-sp-chlorine hover:text-sp-ink ${className}`}
    >
      CHECK OUT · {cart} {cart === 1 ? "ITEM" : "ITEMS"}
    </a>
  );
}
