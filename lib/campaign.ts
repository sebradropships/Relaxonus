/**
 * Campaign and merchandising configuration.
 *
 * Everything the storefront's marketing surfaces read comes from here, so the
 * components stay dumb and the offers stay editable in one place. Nothing in
 * this file is hardcoded into a component.
 */

import type { VariantKey } from "@/lib/product";

/* -------------------------------- Countdown ------------------------------- */

export type CountdownMode = "fixed" | "recurring" | "off";

export const COUNTDOWN = {
  /**
   * "fixed"     — counts to `endsAt` once, then disappears.
   * "recurring" — repeats on a fixed cycle, forever.
   * "off"       — no clock, banner still shows the live discount.
   */
  mode: "recurring" as CountdownMode,

  /** Used by "fixed" only. */
  endsAt: null as string | null,
  endsAtSpoken: null as string | null,

  /** Used by "recurring" only. Length of one window, in hours. */
  cycleHours: 3,

  /**
   * Anchor for the recurring cycle. The window is computed from this instant,
   * NOT from when a visitor arrived, so everyone sees the same clock and a
   * reload does not bounce the timer back up to full. Change it to shift when
   * the cycle turns over.
   */
  cycleAnchor: "2026-08-31T00:00:00Z",

  /**
   * Wording sits next to the clock. Set it to whatever the campaign actually
   * is — on a recurring cycle the offer refreshes rather than terminates, so
   * the default says so.
   */
  label: "Live sale",
  countdownLabel: "Offer refreshes in",
} as const;

/** Milliseconds left in the current window, or null when there is no clock. */
export function countdownRemaining(now: number): number | null {
  if (COUNTDOWN.mode === "off") return null;

  if (COUNTDOWN.mode === "fixed") {
    if (!COUNTDOWN.endsAt) return null;
    const end = new Date(COUNTDOWN.endsAt).getTime();
    if (Number.isNaN(end)) return null;
    const left = end - now;
    return left > 0 ? left : null;
  }

  const anchor = new Date(COUNTDOWN.cycleAnchor).getTime();
  if (Number.isNaN(anchor)) return null;
  const cycle = COUNTDOWN.cycleHours * 3_600_000;
  if (cycle <= 0) return null;

  /* Modulo of the elapsed time gives the position inside the current window.
     Works before the anchor too, hence the double modulo. */
  const elapsed = ((now - anchor) % cycle + cycle) % cycle;
  return cycle - elapsed;
}

/* ------------------------------- Free shipping ---------------------------- */

export const SHIPPING = {
  /** Cart subtotal, in store currency, that unlocks free shipping. */
  freeThreshold: 60,
  /** Set false if you are not actually offering it. */
  enabled: true,
  labels: {
    progress: (remaining: string) => `You're ${remaining} away from free shipping`,
    unlocked: "Free shipping unlocked",
  },
} as const;

/* --------------------------------- Stock ---------------------------------- */

export const STOCK = {
  /**
   * Show a low-stock line at or below this many units.
   *
   * Counts come from Shopify when the Storefront token carries the
   * `unauthenticated_read_product_inventory` scope. Without it the API returns
   * null, and the component renders nothing rather than guessing — so this
   * lights up on its own once the scope is granted.
   */
  lowStockThreshold: 20,
  /** Never show a count above this, even if inventory is genuinely higher. */
  hideAbove: 20,
} as const;

/* --------------------------------- Upsell --------------------------------- */

export const UPSELL = {
  enabled: true,
  /** Offered in the cart when one of these is the only thing in it. */
  fromVariants: ["blue", "pink"] as VariantKey[],
  toVariant: "set" as VariantKey,
  heading: "Add the other colour and save",
  body: (saving: string) => `Upgrade to the pair and save ${saving} against two singles.`,
  cta: "Upgrade to the Duo",
} as const;
