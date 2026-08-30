"use client";

import { useEffect, useState } from "react";

import { useProduct } from "@/components/ProductProvider";
import { SALE, TIER_ORDER } from "@/lib/product";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/* One wave period, in user units. The flow animation travels exactly this far,
   which is what keeps the crests from lurching on each loop. */
const WAVE = 400;
const PERIODS = 8;
const RIBBON_W = WAVE * PERIODS;
const RIBBON_H = 48;

/* A smooth quadratic wave: one `q` to open it, then mirrored `t` segments.
   Each 200-unit segment is half a period, so two make up WAVE. */
const WAVE_PATH =
  `M0,${RIBBON_H / 2} q100,-15 200,0 ` +
  Array.from({ length: PERIODS * 2 - 1 }, () => "t200,0").join(" ");

/**
 * The SALE ribbon: lettering running along a flowing wave rather than a flat
 * band.
 *
 * The trick is that the wave is periodic and the animation travels exactly one
 * wavelength, so the crests land back where they started every cycle. The wave
 * therefore looks stationary while the text streams through it, and the loop
 * has no seam. The band is drawn wider than any realistic viewport so the
 * translate never exposes an end.
 *
 * The whole thing is aria-hidden with one sr-only word beside it: a screen
 * reader should hear "sale" once, not sixty times.
 */
function SaleStrip() {
  const letters = Array.from({ length: 60 }, () => "SALE").join("     ·     ");

  return (
    <div
      className="relative overflow-hidden bg-[#c8322a] [contain:paint]"
      style={{ height: RIBBON_H }}
    >
      <svg
        aria-hidden="true"
        className="ribbon absolute left-0 top-0"
        width={RIBBON_W}
        height={RIBBON_H}
        viewBox={`0 0 ${RIBBON_W} ${RIBBON_H}`}
        role="presentation"
      >
        <defs>
          <path id="sale-wave" d={WAVE_PATH} fill="none" />
        </defs>
        <text
          fill="#ffffff"
          fontSize="13"
          fontWeight="700"
          letterSpacing="2.4"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          dominantBaseline="middle"
        >
          <textPath href="#sale-wave">{letters}</textPath>
        </text>
      </svg>
      <span className="sr-only">Sale</span>
    </div>
  );
}

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <span className="flex items-baseline gap-0.5">
      <span className="num font-semibold tabular-nums">{value}</span>
      <span className="text-[10px] font-medium opacity-70">{label}</span>
    </span>
  );
}

/**
 * Sale strip above the header, with a countdown to the promotion's real end.
 *
 * Two independent gates, and both must be open for anything to render:
 *
 *   1. A genuine discount is live in Shopify. The percentage shown is derived
 *      from the deepest real `compareAtPrice` reduction across the variants,
 *      so this strip cannot advertise a sale the store is not actually running.
 *   2. SALE.endsAt is still in the future. Once it passes the strip removes
 *      itself, so a stale deadline is never displayed and the countdown can
 *      never sit at zero or restart for the next visitor.
 *
 * The ticking figures are aria-hidden and the deadline is given once, as a
 * date, to assistive technology — a per-second live region would make the page
 * unusable with a screen reader.
 */
export function SaleBanner() {
  const { discountPercentFor } = useProduct();

  /* null until the client has read the clock: the server cannot know the
     remaining time, and rendering a guess would be a hydration mismatch. */
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!SALE.endsAt) return;
    const deadline = new Date(SALE.endsAt).getTime();
    if (Number.isNaN(deadline)) return;

    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const best = TIER_ORDER.reduce((deepest, key) => {
    const percent = discountPercentFor(key);
    return percent && percent > deepest ? percent : deepest;
  }, 0);

  /* The only gate on the banner itself: a real reduction is live in Shopify.
     The percentage is derived from it, so this cannot advertise a discount the
     store is not running. */
  if (best <= 0) return null;

  /* The countdown is a separate question from the discount. It appears only
     for a genuine future deadline, and vanishes the moment that passes — the
     discount may well outlive it, and a spent clock must not linger over one. */
  const deadlineMs = SALE.endsAt ? new Date(SALE.endsAt).getTime() : NaN;
  const showCountdown =
    Number.isFinite(deadlineMs) && remaining !== null && remaining > 0;

  const totalSeconds = remaining === null ? 0 : Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="text-white">
      {/* Background sits on the full-bleed wrapper, not on `.shell` — that is
          max-width constrained and would leave the colour short of the edges
          on a wide screen. */}
      <div className="bg-accent">
        <div className="shell flex min-h-11 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center">
          <p className="eyebrow">
            {SALE.label} · {best}% off
          </p>

          {showCountdown && (
            <>
              <span aria-hidden="true" className="hidden opacity-40 sm:inline">
                |
              </span>

              <p className="flex items-baseline gap-1.5 text-[13px]">
                <span className="opacity-70">{SALE.countdownLabel}</span>
                <span aria-hidden="true" className="flex items-baseline gap-1.5">
                  {days > 0 && <Unit value={String(days)} label="d" />}
                  <Unit value={pad(hours)} label="h" />
                  <Unit value={pad(minutes)} label="m" />
                  <Unit value={pad(seconds)} label="s" />
                </span>
                {SALE.endsAtSpoken && (
                  <span className="sr-only">Sale ends {SALE.endsAtSpoken}.</span>
                )}
              </p>
            </>
          )}
        </div>
      </div>

      <SaleStrip />
    </div>
  );
}
