"use client";

import { useEffect, useState } from "react";

import { useProduct } from "@/components/ProductProvider";
import { SALE, TIER_ORDER } from "@/lib/product";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/**
 * Sliding SALE strip beneath the banner.
 *
 * The track is rendered twice and the animation shifts it by exactly half, so
 * it loops without a seam. Both copies are aria-hidden and a single sr-only
 * word carries the meaning — a screen reader should hear "sale" once, not
 * twenty times.
 */
function SaleStrip() {
  const track = (
    <div aria-hidden="true" className="flex shrink-0 items-center gap-7 pr-7">
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} className="eyebrow whitespace-nowrap text-white/95">
          SALE
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden bg-[#c8322a] py-1.5 [contain:paint]">
      <div className="marquee flex min-w-max">
        {track}
        {track}
      </div>
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
