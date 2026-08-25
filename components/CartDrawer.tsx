"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { useProduct } from "@/components/ProductProvider";
import { formatMoney } from "@/lib/money";
import { MAX_QUANTITY } from "@/lib/product";

/**
 * Right-side panel on desktop, full-width bottom sheet on mobile — one
 * component, no separate mobile variant to drift out of sync.
 *
 * Shopify is the source of truth for every number rendered here: quantity,
 * line total and subtotal all come straight from the cart the server actions
 * return, never recomputed client-side.
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

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeCart();
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
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
        className="absolute inset-0 bg-sp-black/70"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className="sp-cart-drawer fixed inset-x-0 bottom-0 z-[71] flex max-h-[88vh] flex-col border-t-[3px] border-sp-paper bg-sp-black min-[640px]:inset-y-0 min-[640px]:left-auto min-[640px]:right-0 min-[640px]:max-h-none min-[640px]:w-full min-[640px]:max-w-[420px] min-[640px]:border-l-[3px] min-[640px]:border-t-0"
      >
        <div className="flex items-center justify-between gap-4 border-b-[3px] border-sp-rule px-5 py-4">
          <h2 className="sp-display text-xl text-sp-paper">
            YOUR CART{" "}
            <span key={cart} className="sp-count-pop sp-num inline-block text-sp-mist">
              · {cart}
            </span>
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="sp-tap sp-squeeze grid size-11 shrink-0 place-items-center border-[3px] border-sp-paper text-xl leading-none text-sp-paper transition-colors hover:bg-sp-bubblegum hover:text-sp-ink"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {lineError && (
          <p role="alert" className="border-b-[3px] border-sp-no bg-sp-carbon px-5 py-3 text-[14px] text-sp-paper">
            {lineError}
          </p>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {empty ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <p className="sp-display text-2xl text-sp-paper">YOUR CART IS EMPTY</p>
              <p className="text-[15px] text-sp-mist">Your next squeeze is waiting.</p>
              <a
                href="#top"
                onClick={closeCart}
                className="sp-squeeze sp-display mt-3 border-[3px] border-sp-black bg-sp-bubblegum px-6 py-4 text-sm text-sp-ink"
              >
                SHOP THE MASSAGER
              </a>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {lines.map((line) => {
                const busy = Boolean(lineBusy[line.id]);
                const atMax = line.quantity >= MAX_QUANTITY;

                return (
                  <li key={line.id} className="flex gap-4 border-b-[3px] border-sp-rule pb-5 last:border-b-0 last:pb-0">
                    <span className="relative size-20 shrink-0 border-[3px] border-sp-paper bg-sp-carbon">
                      {line.image && (
                        <Image
                          src={line.image.url}
                          alt={line.image.altText ?? ""}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </span>

                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="sp-display block truncate text-[15px] text-sp-paper">
                            {line.title}
                          </span>
                          <span className="sp-mono block text-[12px] text-sp-mist">
                            {line.variantLabel}
                          </span>
                        </span>
                        <span className="sp-display sp-num shrink-0 text-[15px] text-sp-paper">
                          {formatMoney(line.lineTotal)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-stretch border-[3px] border-sp-paper">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => setLineQuantity(line.id, line.quantity - 1)}
                            aria-label={line.quantity <= 1 ? `Remove ${line.title}` : "Decrease quantity"}
                            className="sp-squeeze grid size-11 place-items-center text-lg leading-none text-sp-paper transition-colors hover:bg-sp-bubblegum hover:text-sp-ink disabled:cursor-not-allowed disabled:text-sp-rule disabled:hover:bg-transparent disabled:hover:text-sp-rule"
                          >
                            <span aria-hidden="true">−</span>
                          </button>
                          <output
                            aria-live="polite"
                            className="sp-display sp-num flex min-w-[2.75rem] items-center justify-center text-sm text-sp-paper"
                          >
                            {busy ? "…" : line.quantity}
                          </output>
                          <button
                            type="button"
                            disabled={busy || atMax}
                            onClick={() => setLineQuantity(line.id, line.quantity + 1)}
                            aria-label="Increase quantity"
                            className="sp-squeeze grid size-11 place-items-center text-lg leading-none text-sp-paper transition-colors hover:bg-sp-chlorine hover:text-sp-ink disabled:cursor-not-allowed disabled:text-sp-rule disabled:hover:bg-transparent disabled:hover:text-sp-rule"
                          >
                            <span aria-hidden="true">+</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => removeCartLine(line.id)}
                          className="sp-mono text-[12px] text-sp-mist underline decoration-sp-rule underline-offset-4 transition-colors hover:text-sp-no disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          REMOVE
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
          <div className="border-t-[3px] border-sp-paper bg-sp-carbon px-5 py-5">
            <div className="flex items-center justify-between">
              <span className="sp-mono text-[13px] text-sp-mist">SUBTOTAL</span>
              <span className="sp-display sp-num text-2xl text-sp-paper">
                {subtotal ? formatMoney(subtotal) : ""}
              </span>
            </div>
            <p className="sp-disclosure mt-1 text-sp-mist">Shipping calculated at checkout.</p>

            <a
              href={checkoutUrl ?? "#top"}
              className="sp-squeeze sp-display mt-4 block w-full border-[3px] border-sp-black bg-sp-bubblegum px-6 py-4 text-center text-base text-sp-ink transition-colors hover:bg-sp-chlorine"
            >
              CHECK OUT — {subtotal ? formatMoney(subtotal) : ""}
            </a>
            <button
              type="button"
              onClick={closeCart}
              className="sp-mono mt-3 block w-full text-center text-[13px] text-sp-mist underline decoration-sp-rule underline-offset-4 hover:text-sp-chlorine"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
