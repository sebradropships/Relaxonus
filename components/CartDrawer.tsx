"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { useProduct } from "@/components/ProductProvider";
import { formatMoney } from "@/lib/money";
import { MAX_QUANTITY } from "@/lib/product";

/**
 * Bottom sheet on a phone, side panel from 720px up — one component, so the
 * two can never drift apart.
 *
 * Shopify is the source of truth for every number here. Quantity, line total
 * and subtotal all come straight back from the cart the server action
 * returned; nothing is recomputed client-side, so the drawer can never show a
 * total the checkout will disagree with.
 */
export function CartDrawer() {
  const {
    cartOpen,
    closeCart,
    lines,
    subtotal,
    checkoutUrl,
    cart,
    lineBusy,
    lineError,
    setLineQuantity,
    removeCartLine,
  } = useProduct();

  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!cartOpen) return;

    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [cartOpen, closeCart]);

  if (!cartOpen) return null;

  const empty = lines.length === 0;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="fade absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className="sheet absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col rounded-t-2xl bg-paper min-[720px]:inset-y-0 min-[720px]:left-auto min-[720px]:right-0 min-[720px]:max-h-none min-[720px]:w-full min-[720px]:max-w-[420px] min-[720px]:rounded-none"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="display text-lg text-ink">
            Your cart
            {cart > 0 && (
              <span className="num font-medium text-muted"> · {cart} {cart === 1 ? "item" : "items"}</span>
            )}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="tap -mr-2 grid w-11 place-items-center rounded-lg text-xl leading-none text-muted transition-colors hover:text-ink"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {lineError && (
          <p role="alert" className="border-b border-line bg-save-soft px-5 py-3 text-sm text-save">
            {lineError}
          </p>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {empty ? (
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <p className="display text-lg text-ink">Your cart is empty</p>
              <p className="text-[15px] text-muted">Nothing in here yet.</p>
              <button
                type="button"
                onClick={closeCart}
                className="btn btn-quiet tap mt-2 px-5 py-3 text-sm"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {lines.map((line) => {
                const busy = Boolean(lineBusy[line.id]);
                const atMax = line.quantity >= MAX_QUANTITY;

                return (
                  <li key={line.id} className="flex gap-3.5">
                    <span className="relative size-[72px] shrink-0 overflow-hidden rounded-xl border border-line bg-surface">
                      {line.image && (
                        <Image
                          src={line.image.url}
                          alt={line.image.altText ?? ""}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      )}
                    </span>

                    <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block text-[14px] font-semibold leading-snug text-ink">
                            Relaxonus Massager
                          </span>
                          <span className="block text-[13px] text-muted">{line.variantLabel}</span>
                        </span>
                        <span className="num shrink-0 text-[14px] font-semibold text-ink">
                          {formatMoney(line.lineTotal)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-stretch overflow-hidden rounded-lg border border-line-strong bg-surface">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => setLineQuantity(line.id, line.quantity - 1)}
                            aria-label={
                              line.quantity <= 1 ? "Remove item" : "Decrease quantity"
                            }
                            className="grid size-11 place-items-center text-lg leading-none text-ink transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:text-faint"
                          >
                            <span aria-hidden="true">−</span>
                          </button>
                          <output
                            aria-live="polite"
                            className="num grid w-10 place-items-center border-x border-line text-sm font-semibold text-ink"
                          >
                            {busy ? "·" : line.quantity}
                          </output>
                          <button
                            type="button"
                            disabled={busy || atMax}
                            onClick={() => setLineQuantity(line.id, line.quantity + 1)}
                            aria-label="Increase quantity"
                            className="grid size-11 place-items-center text-lg leading-none text-ink transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:text-faint"
                          >
                            <span aria-hidden="true">+</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => removeCartLine(line.id)}
                          className="tap inline-flex items-center px-1 text-[13px] text-muted underline underline-offset-4 transition-colors hover:text-save disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {!empty && (
          <div className="border-t border-line bg-surface px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[15px] text-muted">Subtotal</span>
              <span className="display num text-2xl text-ink">
                {subtotal ? formatMoney(subtotal) : ""}
              </span>
            </div>
            <p className="disclosure mt-1">Shipping calculated at checkout.</p>

            <a
              href={checkoutUrl ?? "#top"}
              className="btn btn-primary tap-lg mt-4 w-full px-6 py-4 text-base"
            >
              CHECKOUT{subtotal ? ` — ${formatMoney(subtotal)}` : ""}
            </a>

            <button
              type="button"
              onClick={closeCart}
              className="tap mt-1 w-full text-[13px] text-muted underline underline-offset-4 transition-colors hover:text-ink"
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
