"use client";

import { useRef, type KeyboardEvent } from "react";

import { useProduct } from "@/components/ProductProvider";
import {
  BASIS_LINE,
  BASIS_TAG,
  STRIKE_SR_PREFIX,
  TIERS,
  TIER_GROUP_LABEL,
  TIER_ORDER,
} from "@/lib/product";

const ARROWS = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];

/**
 * Built only from the two real SKUs: the $29.99 single in two colourways, and
 * the $47.99 Duo whose $59.98 reference is what two singles actually cost.
 *
 * Selection is carried by four independent signals — border colour, fill
 * change, a check disc, and aria-checked — so it never depends on hue alone.
 */
export function TierSelector() {
  const { variant, selectVariant, priceFor, compareAtFor } = useProduct();
  const boxes = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!ARROWS.includes(event.key)) return;
    const current = TIER_ORDER.indexOf(variant);
    if (current === -1) return;

    event.preventDefault();
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const next = (current + (forward ? 1 : -1) + TIER_ORDER.length) % TIER_ORDER.length;
    selectVariant(TIER_ORDER[next]);
    boxes.current[next]?.focus();
  }

  return (
    <div>
      <span id="tier-label" className="sp-mono block text-[13px] text-sp-mist">
        {TIER_GROUP_LABEL}
      </span>

      <div
        role="radiogroup"
        aria-labelledby="tier-label"
        onKeyDown={handleKeyDown}
        className="mt-3 flex flex-col gap-3"
      >
        {TIER_ORDER.map((key, index) => {
          const tier = TIERS[key];
          const selected = key === variant;
          const compareAt = compareAtFor(key);

          return (
            <button
              key={key}
              ref={(node) => {
                boxes.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectVariant(key)}
              className={[
                "sp-tier sp-squeeze relative block w-full border-[3px] p-5 text-left transition-colors",
                selected
                  ? "border-sp-chlorine bg-sp-carbon-lift sp-hard-cyan"
                  : "border-sp-paper bg-sp-carbon hover:border-sp-chlorine",
                tier.badge ? "-mx-2 pt-7" : "",
              ].join(" ")}
            >
              {tier.badge && (
                <span
                  className="sp-sticker sp-display absolute -top-3 left-3 max-w-[calc(100%-1.5rem)] border-[3px] border-sp-black bg-sp-bubblegum px-2 py-1 text-xs text-sp-ink"
                  style={{ animationDelay: "420ms" }}
                >
                  {tier.badge}
                </span>
              )}

              {/* Below 480px the price drops to its own row. Squeezed into a
                  third column at 320px it forced the copy to two words a line. */}
              <span className="grid grid-cols-[44px_1fr] items-center gap-x-4 gap-y-3 min-[480px]:grid-cols-[44px_1fr_auto]">
                <span
                  aria-hidden="true"
                  className="size-11 shrink-0 self-start border-[3px] border-sp-black min-[480px]:self-center"
                  style={{ background: tier.swatch }}
                />

                <span className="min-w-0">
                  <span className="sp-display block text-lg leading-tight text-sp-paper">
                    {tier.title}
                  </span>
                  <span className="mt-1 block text-[15px] leading-snug text-sp-paper">
                    {tier.sub}
                  </span>
                  <span className="sp-mono mt-1 block text-[13px] text-sp-mist">
                    {tier.perUnit}
                  </span>
                </span>

                <span className="col-start-2 flex flex-wrap items-baseline gap-x-2 min-[480px]:col-start-3 min-[480px]:row-start-1 min-[480px]:flex-col min-[480px]:items-end">
                  {compareAt && (
                    <>
                      <span className="sr-only">{STRIKE_SR_PREFIX}</span>
                      <s className="sp-strike sp-num text-base text-sp-mist">{compareAt}</s>
                    </>
                  )}
                  <span className="sp-display sp-num text-2xl leading-none text-sp-paper">
                    {priceFor(key)}
                  </span>
                </span>
              </span>

              {/* Full-width, so the long basis label cannot squeeze the copy
                  column. Always visible, never a tooltip. */}
              {compareAt && (
                <span
                  aria-hidden="true"
                  className="sp-disclosure mt-3 block border-t-2 border-sp-rule pt-2 text-[12px] text-sp-mist"
                >
                  {BASIS_TAG} — {compareAt}
                </span>
              )}

              {selected && (
                <span
                  aria-hidden="true"
                  className="sp-tick-disc absolute -right-3 -top-3 grid size-7 place-items-center rounded-full bg-sp-chlorine text-sm font-black text-sp-ink"
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Ships verbatim. This sentence is what the strikethrough rests on. */}
      <p className="sp-disclosure mt-3 text-sp-mist">{BASIS_LINE}</p>
    </div>
  );
}
