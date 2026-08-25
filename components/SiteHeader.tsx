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
  const { cart, checkoutUrl, priceFor, variant } = useProduct();
  const canCheckout = cart > 0 && Boolean(checkoutUrl);

  return (
    /* Fully opaque, never translucent — a see-through header over the pink
       marquee has undefined contrast. */
    <header className="sticky top-11 z-40 border-b-[3px] border-sp-paper bg-sp-black">
      <div className="sp-shell flex h-16 items-center justify-between gap-4">
        <a href="#top" className="sp-display flex items-center gap-2 text-lg text-sp-paper">
          <RollerMark />
          RELAXONUS
        </a>

        <nav className="hidden items-center gap-6 min-[900px]:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="sp-mono text-[13px] text-sp-mist transition-colors hover:text-sp-chlorine"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <MotionToggle className="hidden sm:inline-block" />

          {/* Mirrors the live tier — never hardcodes a price the buy box contradicts. */}
          <a
            href={canCheckout ? (checkoutUrl as string) : "#top"}
            className="sp-display sp-squeeze border-[3px] border-sp-black bg-sp-bubblegum px-4 py-2 text-sm text-sp-ink"
          >
            {canCheckout ? `CHECK OUT · ${cart}` : `ADD — ${priceFor(variant)}`}
          </a>
        </div>
      </div>
    </header>
  );
}
