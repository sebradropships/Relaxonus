"use client";

import { useId } from "react";

import { useProduct } from "@/components/ProductProvider";

/* A 24-point starburst, generated rather than hand-plotted so the spike count
   and depth stay adjustable without redrawing a path by hand. */
const POINTS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
  const radius = i % 2 === 0 ? 50 : 40.5;
  return `${(50 + radius * Math.cos(angle)).toFixed(2)},${(50 + radius * Math.sin(angle)).toFixed(2)}`;
}).join(" ");

/* Shallow 30-tooth scallop — the milled edge of the seal, not a starburst. */
const SCALLOP = Array.from({ length: 60 }, (_, i) => {
  const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
  const radius = i % 2 === 0 ? 50 : 45.5;
  return `${(50 + radius * Math.cos(angle)).toFixed(2)},${(50 + radius * Math.sin(angle)).toFixed(2)}`;
}).join(" ");

function Star({ x, y, size }: { x: number; y: number; size: number }) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? size : size * 0.42;
    return `${(x + r * Math.cos(angle)).toFixed(2)},${(y + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");
  return <polygon points={points} fill="#e8c976" />;
}

/**
 * The Duo's seal, in the corner of its own option row.
 *
 * "Best value" is arithmetic here, not a popularity claim: the pair works out
 * at $25.00 a massager against $34.99 bought singly. The banner carries the
 * live reduction, so the badge always states something a shopper can check
 * against the prices beneath it.
 *
 * aria-hidden — the saving is already announced properly by the price below,
 * and once is enough.
 */
export function BestValueSticker() {
  const { discountPercentFor } = useProduct();
  /* Unique per instance: this seal renders in both the hero and the closing
     panel, and two identical gradient ids in one document collide. */
  const uid = useId().replace(/:/g, "");
  const percent = discountPercentFor("set");

  if (percent === null) return null;

  const gold = `gold-${uid}`;
  const arcTop = `arc-top-${uid}`;
  const arcBottom = `arc-bottom-${uid}`;

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -right-2 -top-4 z-10 size-[66px] drop-shadow-md sm:-right-2.5 sm:size-[74px]"
    >
      <svg viewBox="0 0 100 100" className="size-full" role="presentation">
        <defs>
          <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f7e6a8" />
            <stop offset="38%" stopColor="#d9a825" />
            <stop offset="62%" stopColor="#f3dc93" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>
          {/* Upper arc runs left→right over the top; lower arc sweeps the other
              way so its text sits upright rather than inverted. */}
          <path id={arcTop} d="M 21,50 A 29,29 0 0 1 79,50" fill="none" />
          <path id={arcBottom} d="M 20,50 A 30,30 0 0 0 80,50" fill="none" />
        </defs>

        <polygon points={SCALLOP} fill={`url(#${gold})`} />
        <circle cx="50" cy="50" r="41" fill="#17171a" />
        <circle cx="50" cy="50" r="41" fill="none" stroke={`url(#${gold})`} strokeWidth="1.2" />

        <text
          fill="#ffffff"
          fontSize="11"
          fontWeight="800"
          letterSpacing="1.1"
          fontFamily="var(--font-manrope), system-ui, sans-serif"
        >
          <textPath href={`#${arcTop}`} startOffset="50%" textAnchor="middle">
            BEST VALUE
          </textPath>
        </text>
        <text
          fill="#ffffff"
          fontSize="9"
          fontWeight="700"
          letterSpacing="1"
          fontFamily="var(--font-manrope), system-ui, sans-serif"
        >
          <textPath href={`#${arcBottom}`} startOffset="50%" textAnchor="middle">
            BEST VALUE
          </textPath>
        </text>

        <Star x={26} y={57} size={3.4} />
        <Star x={74} y={57} size={3.4} />

        {/* The banner overhangs the disc, as on a real seal, and carries the
            live figure so the badge states something checkable. */}
        <g transform="rotate(-9 50 50)">
          <rect x="3" y="40.5" width="94" height="19" fill={`url(#${gold})`} />
          <rect
            x="3"
            y="40.5"
            width="94"
            height="19"
            fill="none"
            stroke="#8a6a12"
            strokeWidth="0.7"
          />
          <text
            x="50"
            y="54.2"
            textAnchor="middle"
            fill="#17171a"
            fontSize="13.5"
            fontWeight="800"
            fontFamily="var(--font-manrope), system-ui, sans-serif"
          >
            SAVE {percent}%
          </text>
        </g>
      </svg>
    </span>
  );
}

/**
 * The starburst over the top-left of the hero gallery.
 *
 * Gated on a genuine live discount, exactly like the banner and the price
 * badges: if Shopify is not actually running a reduction on the selected
 * option, no sticker appears. It is the loudest element on an otherwise quiet
 * page, so it must never be the one making a claim the prices do not support.
 *
 * aria-hidden — it restates a discount the price block already announces with
 * the real numbers, and a screen reader should hear that once, not twice.
 */
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
