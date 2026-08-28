"use client";

import Image from "next/image";

import { AddToCart, CartError, PriceBlock, VariantPicker } from "@/components/Buy";
import { useBuyZone, useProduct } from "@/components/ProductProvider";
import { CLOSE, LEGAL, VARIANTS } from "@/lib/product";

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
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
 * SECTION 3 — the close. A complete second purchase point, so a visitor who
 * scrolled the whole page never has to scroll back up to buy.
 */
export function Close() {
  const { variant } = useProduct();
  const buyZone = useBuyZone();
  const option = VARIANTS[variant];

  return (
    <section id="buy-now" className="py-16 sm:py-24">
      <div className="shell">
        <div className="card mx-auto max-w-3xl overflow-hidden">
          <div className="grid sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
            <div className="relative aspect-[4/3] sm:aspect-auto">
              <Image
                src={option.frames[0].url}
                alt={option.frames[0].alt}
                fill
                sizes="(max-width: 639px) 100vw, 330px"
                className="object-cover"
              />
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-[length:var(--text-h2)] text-ink">{CLOSE.heading}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{CLOSE.deck}</p>

              <div className="mt-6">
                <PriceBlock compact />
              </div>

              <div className="mt-5">
                <VariantPicker />
              </div>

              <div ref={buyZone} className="mt-5 flex flex-col gap-3">
                <AddToCart />
                <CartError />
              </div>

              <ul className="mt-6 grid gap-2 border-t border-line pt-5">
                {CLOSE.trust.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[14px] text-ink">
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="disclosure mt-4">{CLOSE.reassurance}</p>
            </div>
          </div>
        </div>

        {/* Compliance, not a footer. Small, factual, and required: the pricing
            basis substantiates the Duo's single strikethrough, and the device
            disclaimer keeps a comfort accessory from reading as a treatment. */}
        <div className="mx-auto mt-12 max-w-3xl border-t border-line pt-6">
          <p className="disclosure">{LEGAL.disclaimer}</p>
          <p className="disclosure mt-2">{LEGAL.pricing}</p>
          <p className="disclosure mt-4 text-faint">{LEGAL.copyright}</p>
        </div>
      </div>
    </section>
  );
}
