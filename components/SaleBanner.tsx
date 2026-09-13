"use client";

import { useEffect, useState } from "react";

import { TruckIcon } from "@/components/FreeShipping";
import { useProduct } from "@/components/ProductProvider";
import { COUNTDOWN, SHIPPING, countdownRemaining } from "@/lib/campaign";
import { TIER_ORDER } from "@/lib/product";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/**
 * Sliding SALE strip beneath the banner, alternating with the free-shipping
 * promise while it holds.
 *
 * The track is rendered twice and the animation shifts it by exactly half, so
 * it loops without a seam. Both copies are aria-hidden and a single sr-only
 * line carries the meaning — a screen reader should hear it once, not twenty
 * times.
 */
function SaleStrip() {
  const track = (
    <div aria-hidden="true" className="flex shrink-0 items-center gap-7 pr-7">
      {Array.from({ length: 14 }, (_, i) =>
        SHIPPING.free && i % 2 === 0 ? (
          <span key={i} className="eyebrow inline-flex items-center gap-1.5 whitespace-nowrap text-white/95">
            <TruckIcon size={14} />
            {SHIPPING.labels.short}
          </span>
        ) : (
          <span key={i} className="eyebrow whitespace-nowrap text-white/95">
            SALE
          </span>
        ),
      )}
    </div>
  );

  return (
    <div className="relative overflow-hidden bg-[#c8322a] py-1.5 [contain:paint]">
      {/* The longer track gets a proportionally longer cycle, so the words
          travel at the same speed as the SALE-only strip did: 1571px against
          913px, measured, so 20s becomes 34s. */}
      <div
        className="marquee flex min-w-max"
        style={SHIPPING.free ? { animationDuration: "34s" } : undefined}
      >
        {track}
        {track}
      </div>
      <span className="sr-only">{SHIPPING.free ? `Sale. ${SHIPPING.labels.full}.` : "Sale"}</span>
    </div>
  );
}

/** With no sale on, the bar still carries the free-shipping promise, alone. */
function ShippingBar() {
  return (
    <div className="bg-accent text-white">
      <div className="shell flex min-h-11 items-center justify-center py-2 text-center">
        <p className="eyebrow inline-flex items-center gap-2">
          <TruckIcon size={16} />
          {SHIPPING.labels.full}
        </p>
      </div>
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
 * Sale banner and campaign clock.
 *
 * The banner has one gate: a genuine reduction live in Shopify. The percentage
 * is the deepest real compare-at across the variants, so it cannot advertise a
 * discount the store is not running.
 *
 * The clock is a separate question, set entirely by COUNTDOWN.mode in
 * lib/campaign.ts — a fixed deadline that expires and takes the clock with it,
 * a recurring window that keeps cycling, or off. The banner survives on the
 * discount either way.
 *
 * Ticking figures are aria-hidden and the spoken form describes the window
 * rather than the seconds: a per-second live region would make the page
 * unusable with a screen reader.
 */
export function SaleBanner() {
  const { discountPercentFor } = useProduct();

  /* null until the client has read the clock: the server cannot know the
     remaining time, and rendering a guess would be a hydration mismatch. */
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(countdownRemaining(Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const best = TIER_ORDER.reduce((deepest, key) => {
    const percent = discountPercentFor(key);
    return percent && percent > deepest ? percent : deepest;
  }, 0);

  /* The only gate on the sale banner itself: a real reduction is live in
     Shopify. The percentage is derived from it, so this cannot advertise a
     discount the store is not running. Without one, only the free-shipping
     bar remains. */
  if (best <= 0) return SHIPPING.free ? <ShippingBar /> : null;

  /* The clock is a separate question from the discount: a recurring window
     keeps running, a fixed one expires, and either way the banner still shows
     a live reduction on its own. */
  const showCountdown = remaining !== null && remaining > 0;

  const spoken =
    COUNTDOWN.mode === "recurring"
      ? `Offer refreshes every ${COUNTDOWN.cycleHours} hours.`
      : COUNTDOWN.endsAtSpoken
        ? `Sale ends ${COUNTDOWN.endsAtSpoken}.`
        : "";

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
            {COUNTDOWN.label} · {best}% off
          </p>

          {showCountdown && (
            <>
              <span aria-hidden="true" className="hidden opacity-40 sm:inline">
                |
              </span>

              <p className="flex items-baseline gap-1.5 text-[13px]">
                <span className="opacity-70">{COUNTDOWN.countdownLabel}</span>
                <span aria-hidden="true" className="flex items-baseline gap-1.5">
                  {days > 0 && <Unit value={String(days)} label="d" />}
                  <Unit value={pad(hours)} label="h" />
                  <Unit value={pad(minutes)} label="m" />
                  <Unit value={pad(seconds)} label="s" />
                </span>
                {/* Describes the window, not the seconds — a per-second live
                    region would make the page unusable with a screen reader. */}
                {spoken && <span className="sr-only">{spoken}</span>}
              </p>
            </>
          )}
        </div>
      </div>

      <SaleStrip />
    </div>
  );
}
