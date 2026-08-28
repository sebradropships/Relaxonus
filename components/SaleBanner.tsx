"use client";

import { useEffect, useState } from "react";

import { useProduct } from "@/components/ProductProvider";
import { SALE, TIER_ORDER } from "@/lib/product";

function pad(value: number) {
  return String(value).padStart(2, "0");
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

  // Gate 1: nothing is actually discounted in Shopify.
  if (best <= 0) return null;
  // Gate 2: the deadline has passed. Also covers a malformed SALE.endsAt.
  if (remaining === 0) return null;

  const totalSeconds = remaining === null ? 0 : Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="bg-accent text-white">
      <div className="shell flex min-h-11 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center">
        <p className="eyebrow">
          {SALE.label} · {best}% off
        </p>

        <span aria-hidden="true" className="hidden opacity-40 sm:inline">
          |
        </span>

        {/* Reserves its own width before the clock is read, so the header
            below does not jump when the countdown appears. */}
        <p className="flex items-baseline gap-1.5 text-[13px]">
          <span className="opacity-70">{SALE.countdownLabel}</span>
          {remaining === null ? (
            <span aria-hidden="true" className="num opacity-40">
              ——
            </span>
          ) : (
            <span aria-hidden="true" className="flex items-baseline gap-1.5">
              {days > 0 && <Unit value={String(days)} label="d" />}
              <Unit value={pad(hours)} label="h" />
              <Unit value={pad(minutes)} label="m" />
              <Unit value={pad(seconds)} label="s" />
            </span>
          )}
          <span className="sr-only">Sale ends {SALE.endsAtSpoken}.</span>
        </p>
      </div>
    </div>
  );
}
