"use client";

import { useEffect, useState } from "react";

import { useProduct } from "@/components/ProductProvider";
import { COUNTDOWN, countdownRemaining } from "@/lib/campaign";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/**
 * Countdown line for the buy box, sat directly above the options.
 *
 * Gated on the SELECTED option actually being reduced, not merely on a
 * campaign existing: a clock over an undiscounted variant would be counting
 * down to nothing the shopper is being offered.
 *
 * Reserves its own height before the clock is read so the options below do not
 * jump when it appears, and the ticking digits are aria-hidden with the window
 * spoken once — a per-second live region would be unusable with a screen
 * reader.
 */
export function OfferCountdown() {
  const { variant, discountPercentFor } = useProduct();
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(countdownRemaining(Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const percent = discountPercentFor(variant);
  if (percent === null) return null;
  if (COUNTDOWN.mode === "off") return null;

  const total = remaining === null ? 0 : Math.floor(remaining / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  const spoken =
    COUNTDOWN.mode === "recurring"
      ? `Offer refreshes every ${COUNTDOWN.cycleHours} hours.`
      : COUNTDOWN.endsAtSpoken
        ? `Sale ends ${COUNTDOWN.endsAtSpoken}.`
        : "";

  return (
    <div className="flex min-h-9 flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-save-soft px-3 py-2">
      <svg
        width="14"
        height="14"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-save"
      >
        <circle cx="10" cy="10.5" r="7" stroke="currentColor" strokeWidth="1.7" />
        <path d="M10 6.5v4.2l2.6 1.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M7.5 2.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>

      <span className="text-[13px] font-semibold text-save">
        Save {percent}% — {COUNTDOWN.countdownLabel.toLowerCase()}
      </span>

      {remaining === null ? (
        <span aria-hidden="true" className="num text-[13px] font-bold text-save opacity-40">
          --:--:--
        </span>
      ) : (
        <span aria-hidden="true" className="num text-[13px] font-bold tabular-nums text-save">
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </span>
      )}

      {spoken && <span className="sr-only">{spoken}</span>}
    </div>
  );
}
