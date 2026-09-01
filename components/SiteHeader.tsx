"use client";

import Image from "next/image";

import { useProduct } from "@/components/ProductProvider";

function CartGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 4h2.2l2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.55L20.6 8H6.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.35" fill="currentColor" />
      <circle cx="17" cy="20" r="1.35" fill="currentColor" />
    </svg>
  );
}

/**
 * A wordmark and a cart. Nothing else — this is one product, not a catalogue,
 * and every extra link here is a way out of the purchase.
 */
export function SiteHeader() {
  const { cart, openCart } = useProduct();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="shell flex h-14 items-center justify-between gap-4 sm:h-16">
        <a
          href="#top"
          className="tap -ml-1 inline-flex items-center rounded-lg px-1"
        >
          {/* The alt text is the link's accessible name — it has to say the
              brand, not describe the artwork. */}
          <Image
            src="/brand/logo.png"
            alt="Relaxonus"
            width={239}
            height={96}
            priority
            className="h-7 w-auto sm:h-8"
          />
        </a>

        <button
          type="button"
          onClick={openCart}
          aria-label={
            cart > 0 ? `Open cart, ${cart} ${cart === 1 ? "item" : "items"}` : "Cart is empty"
          }
          className="tap relative -mr-2 inline-flex items-center gap-2 rounded-lg px-2.5 text-ink transition-colors hover:text-accent"
        >
          <CartGlyph />
          {cart > 0 && (
            <span
              key={cart}
              className="num pop grid min-w-[19px] place-items-center rounded-full bg-accent px-1.5 text-[11px] font-semibold leading-[19px] text-white"
            >
              {cart}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
