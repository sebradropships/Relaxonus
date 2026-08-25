"use client";

import { AddToCartButton } from "@/components/AddToCartButton";
import { useProduct } from "@/components/ProductProvider";
import { FINAL_CTA, TIERS, TIER_ORDER } from "@/lib/product";

/**
 * The heading deliberately carries no price. A display-size number above a
 * pre-selected tier priced differently is a live deceptive-pricing exposure —
 * the loudest number on the page must be the one the buyer is about to pay.
 */
export function FinalCta() {
  const { variant, selectVariant, priceFor } = useProduct();

  return (
    <section className="relative border-y-[3px] border-sp-black bg-sp-bubblegum py-28">
      <div className="sp-shell text-center">
        <span
          className="sp-sticker sp-display absolute left-6 top-16 hidden border-[3px] border-sp-black bg-sp-chlorine px-3 py-1.5 text-sm text-sp-ink lg:block"
          style={{ animationDelay: "120ms" }}
        >
          {FINAL_CTA.stickers[0]}
        </span>
        <span
          className="sp-sticker sp-display absolute right-6 top-24 hidden border-[3px] border-sp-black bg-sp-black px-3 py-1.5 text-sm text-sp-paper lg:block"
          style={{ animationDelay: "800ms" }}
        >
          {FINAL_CTA.stickers[1]}
        </span>

        <h2 className="text-[length:var(--text-display-xl)] leading-[0.84] text-sp-ink">
          {FINAL_CTA.headingA}
          <br />
          {FINAL_CTA.headingB}
        </h2>

        <div
          role="radiogroup"
          aria-label="Pick your setup"
          className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3"
        >
          {TIER_ORDER.map((key) => {
            const selected = key === variant;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectVariant(key)}
                className={`sp-squeeze sp-display rounded-full border-[3px] px-5 py-3 text-sm transition-colors ${
                  selected
                    ? "border-sp-black bg-sp-black text-sp-paper sp-hard-ink"
                    : "border-sp-black bg-sp-bubblegum text-sp-ink hover:bg-sp-black hover:text-sp-paper"
                }`}
              >
                {TIERS[key].title} — {priceFor(key)}
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-md">
          <AddToCartButton className="!border-sp-black !bg-sp-black !text-sp-paper" />
        </div>

        <p className="sp-disclosure mx-auto mt-6 max-w-[70ch] text-sp-ink">
          {FINAL_CTA.microline}
        </p>
      </div>
    </section>
  );
}
