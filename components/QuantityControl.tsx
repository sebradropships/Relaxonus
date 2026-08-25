"use client";

import { useProduct } from "@/components/ProductProvider";
import { MAX_QUANTITY, VARIANTS } from "@/lib/product";

/**
 * − / quantity / + stepper.
 *
 * Built as two buttons around a live region rather than a number input: a
 * spinner's native arrows are far below a comfortable touch target, and its
 * keyboard is a numeric one on mobile, which invites free text into a field
 * that only accepts 1–10.
 *
 * Every control here is 48px so it clears the 44px minimum with room, and the
 * value is announced politely rather than on every keystroke.
 */
export function QuantityControl({ className = "" }: { className?: string }) {
  const { quantity, setQuantity, variant, pending } = useProduct();

  const units = VARIANTS[variant].units * quantity;
  const atMin = quantity <= 1;
  const atMax = quantity >= MAX_QUANTITY;

  const step = (delta: number) => setQuantity(quantity + delta);

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-4">
        <span id="qty-label" className="sp-mono text-[13px] text-sp-mist">
          QUANTITY
        </span>

        {/* The Duo is two massagers per unit, so the total is worth spelling
            out — "2 × The Duo" is otherwise easy to read as two massagers. */}
        <span className="sp-mono text-[13px] text-sp-mist" aria-hidden="true">
          {units} MASSAGER{units === 1 ? "" : "S"}
        </span>
      </div>

      <div className="mt-2 flex items-stretch border-[3px] border-sp-paper bg-sp-carbon">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={atMin || pending}
          aria-label="Decrease quantity"
          className="sp-squeeze grid size-12 shrink-0 place-items-center border-r-[3px] border-sp-paper text-2xl leading-none text-sp-paper transition-colors hover:bg-sp-bubblegum hover:text-sp-ink disabled:cursor-not-allowed disabled:text-sp-rule disabled:hover:bg-transparent disabled:hover:text-sp-rule"
        >
          <span aria-hidden="true">−</span>
        </button>

        <output
          htmlFor="qty-label"
          aria-live="polite"
          className="sp-display sp-num flex min-w-0 flex-1 items-center justify-center px-2 text-xl text-sp-paper"
        >
          <span className="sr-only">Quantity: </span>
          {quantity}
        </output>

        <button
          type="button"
          onClick={() => step(1)}
          disabled={atMax || pending}
          aria-label="Increase quantity"
          className="sp-squeeze grid size-12 shrink-0 place-items-center border-l-[3px] border-sp-paper text-2xl leading-none text-sp-paper transition-colors hover:bg-sp-chlorine hover:text-sp-ink disabled:cursor-not-allowed disabled:text-sp-rule disabled:hover:bg-transparent disabled:hover:text-sp-rule"
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>

      {atMax && (
        <p className="sp-disclosure mt-2 text-sp-mist">
          {MAX_QUANTITY} per order. Need more? Add to cart, then add again.
        </p>
      )}
    </div>
  );
}
