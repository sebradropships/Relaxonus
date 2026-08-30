"use client";

import { useProduct } from "@/components/ProductProvider";

/* A 24-point starburst, generated rather than hand-plotted so the spike count
   and depth stay adjustable without redrawing a path by hand. */
const POINTS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
  const radius = i % 2 === 0 ? 50 : 40.5;
  return `${(50 + radius * Math.cos(angle)).toFixed(2)},${(50 + radius * Math.sin(angle)).toFixed(2)}`;
}).join(" ");

/**
 * The starburst over the top-left of the hero gallery.
 *
 * Gated on a genuine live discount, exactly like the banner and the price
 * badges: if Shopify is not actually running a reduction on the selected
 * option, no sticker appears. It is the loudest element on an otherwise quiet
 * page, so it must never be the one making a claim the prices do not support.
 *
 * aria-hidden on purpose — it restates the discount the price block already
 * announces properly, and a screen reader should hear that once, with the
 * real numbers, rather than twice.
 */
/**
 * The Duo's badge, in the corner of its own option row.
 *
 * "Best value" here is arithmetic, not a popularity claim: the pair works out
 * at $25.00 a massager against $34.99 bought singly. The percentage is the
 * live reduction, so it cannot drift from the prices beside it.
 *
 * aria-hidden, like the hero sticker — the saving is already announced
 * properly by the price beneath it, and once is enough.
 */
export function BestValueSticker() {
  const { discountPercentFor } = useProduct();
  const percent = discountPercentFor("set");

  if (percent === null) return null;

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -right-1.5 -top-3.5 z-10 size-[62px] -rotate-[14deg] drop-shadow-sm sm:-right-2 sm:size-[68px]"
    >
      <svg viewBox="0 0 100 100" className="size-full" role="presentation">
        <polygon points={POINTS} fill="#e0342b" />
        {/* Sized to clear the inner radius (40.5): at 13px "BEST VALUE" ran
            all the way into the spikes. */}
        <text
          x="50"
          y="41"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="10.5"
          fontWeight="700"
          fontFamily="var(--font-inter), system-ui, sans-serif"
        >
          BEST VALUE
        </text>
        <text
          x="50"
          y="67"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="23"
          fontWeight="800"
          fontFamily="var(--font-manrope), system-ui, sans-serif"
        >
          {percent}%
        </text>
      </svg>
    </span>
  );
}

export function SaleSticker() {
  const { variant, discountPercentFor } = useProduct();

  if (discountPercentFor(variant) === null) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-2 -top-2 z-10 size-[86px] drop-shadow-sm sm:-left-3 sm:-top-3 sm:size-[104px]"
    >
      <svg viewBox="0 0 100 100" className="size-full" role="presentation">
        <polygon points={POINTS} fill="#e0342b" />
        <g transform="rotate(-13 50 50)">
          <text
            x="50"
            y="43"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="12"
            fontWeight="600"
            letterSpacing="1.6"
            fontFamily="var(--font-inter), system-ui, sans-serif"
          >
            SPECIAL
          </text>
          <text
            x="50"
            y="65"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="21"
            fontWeight="800"
            letterSpacing="0.4"
            fontFamily="var(--font-manrope), system-ui, sans-serif"
          >
            PRICE
          </text>
        </g>
      </svg>
    </div>
  );
}
