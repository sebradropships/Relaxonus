"use client";

import { MotionToggle } from "@/components/Motion";
import { useProduct } from "@/components/ProductProvider";
import { NAV_LINKS } from "@/lib/product";

function RollerMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <circle cx="8" cy="7" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="7" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="17" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="17" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function SiteHeader() {
  const { cart, checkoutUrl, priceFor, variant, openCart } = useProduct();
  const canCheckout = cart > 0 && Boolean(checkoutUrl);

  return (
    /* Fully opaque, never translucent — a see-through header over the pink
       marquee has undefined contrast. */
    /* Sticky offset follows the announcement bar, which can be two lines on a
       narrow screen — so it is measured, not assumed at 44px. */
    <header
      className="sticky z-40 border-b-[3px] border-sp-paper bg-sp-black"
      style={{ top: "var(--sp-announce-h, 44px)" }}
    >
      <div className="sp-shell flex min-h-16 items-center justify-between gap-2 py-2 sm:gap-4">
        <a
          href="#top"
          className="sp-tap inline-flex items-center gap-2 sp-display text-base text-sp-paper sm:text-lg"
        >
          <RollerMark />
          RELAXONUS
        </a>

        <nav className="hidden items-center gap-5 min-[900px]:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="sp-tap inline-flex items-center sp-mono text-[13px] text-sp-mist transition-colors hover:text-sp-chlorine"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <MotionToggle className="hidden md:inline-flex" />

          {/* Mirrors the live tier — never hardcodes a price the buy box contradicts.
              Opens the cart drawer rather than jumping straight to Shopify, so the
              shopper always sees what is actually in the cart before checking out. */}
          {canCheckout ? (
            <button
              type="button"
              onClick={openCart}
              className="sp-tap inline-flex items-center sp-display sp-squeeze whitespace-nowrap border-[3px] border-sp-black bg-sp-bubblegum px-3 text-[13px] text-sp-ink sm:px-4 sm:text-sm"
            >
              CHECK OUT ·{" "}
              <span key={cart} className="sp-count-pop ml-1 inline-block">
                {cart}
              </span>
            </button>
          ) : (
            <a
              href="#top"
              className="sp-tap inline-flex items-center sp-display sp-squeeze whitespace-nowrap border-[3px] border-sp-black bg-sp-bubblegum px-3 text-[13px] text-sp-ink sm:px-4 sm:text-sm"
            >
              ADD — {priceFor(variant)}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
