"use client";

import { AddToCart, CartError, PriceBlock, QtyStepper, VariantPicker } from "@/components/Buy";
import { Gallery } from "@/components/Gallery";
import { useBuyZone } from "@/components/ProductProvider";
import { Rating } from "@/components/Rating";
import { HERO } from "@/lib/product";

function Tick() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="mt-[3px] shrink-0"
    >
      <path
        d="M4.5 10.5l3.5 3.5 7.5-8"
        stroke="var(--color-accent)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * SECTION 1 — product, offer and purchase, all reachable without a decision.
 *
 * Mobile order is the conversion order: image, label, headline, price,
 * option, CTA. The supporting bullets sit BELOW the CTA on purpose — they
 * answer a visitor who is still reading, and must never push the buy button
 * off the first screen for one who is not.
 */
export function Hero() {
  const buyZone = useBuyZone();

  return (
    <section id="top" className="shell pt-6 pb-14 sm:pt-10 lg:pb-20">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
        <div className="rise lg:sticky lg:top-24 lg:self-start">
          <Gallery />
        </div>

        <div className="rise" style={{ animationDelay: "80ms" }}>
          {/* Rating sits ahead of the label and renders only once real reviews
              exist, so the row collapses to just the label until then. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Rating />
            <p className="eyebrow text-accent">{HERO.eyebrow}</p>
          </div>

          <h1 className="mt-3 text-[length:var(--text-h1)] text-ink">{HERO.headline}</h1>

          <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed text-muted">{HERO.sub}</p>

          <div className="mt-7">
            <PriceBlock />
          </div>

          <div className="mt-6">
            <VariantPicker />
          </div>

          {/* Stacked, never side by side: a stepper sharing a row with the CTA
              is what clips the CTA at 320px. */}
          <div ref={buyZone} className="mt-6 flex flex-col gap-3">
            <QtyStepper />
            <AddToCart id="buy" />
            <CartError />
          </div>

          <p className="disclosure mt-3 text-center">{HERO.reassurance}</p>

          <ul className="mt-8 flex flex-col gap-2.5 border-t border-line pt-7">
            {HERO.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2.5 text-[15px] leading-snug text-ink">
                <Tick />
                {bullet}
              </li>
            ))}
          </ul>

          <p className="disclosure mt-4">{HERO.shipNote}</p>
        </div>
      </div>
    </section>
  );
}
