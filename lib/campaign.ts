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

  /** Wording next to the clock. */
  label: "Live sale",
  countdownLabel: "Offer ends in",
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

/**
 * Standard shipping is free on every order, with no minimum spend.
 *
 * Checked against the store's own delivery options: a Storefront API cart
 * holding one $34.99 massager, on 2026-09-11 and again on 2026-09-13. The
 * only rate offered is Standard, at $0.00, to New York, California, Alaska
 * and Hawaii alike, and the store sells to the US only, so "every order" is
 * literal.
 *
 * Every free-shipping line on the site is gated on `free`, including the
 * Product JSON-LD. If Shopify ever starts charging, set it false: they all
 * come down together and the copy falls back to "calculated at checkout". A
 * claim the checkout contradicts is worse than no claim at all.
 *
 * The one exception is public/llms.txt, which is static text and states it
 * too. Change that by hand along with this flag.
 */
export const SHIPPING = {
  free: true,
  labels: {
    /** Banner strip and sticky bar, where space is tight. */
    short: "Free shipping",
    /** Everywhere with room for the whole promise. */
    full: "Free shipping on every order",
    /** Top of the cart. */
    cart: "This order ships free",
    /** Shipping wording while `free` is false. */
    calculated: "Shipping calculated at checkout",
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

/* ----------------------------- Quantity breaks ---------------------------- */

/**
 * Volume pricing.
 *
 * `code` must be a real discount code in Shopify. The storefront applies it to
 * the cart rather than drawing a cheaper number next to an unchanged one:
 * checkout charges what Shopify says, so a display-only break would show a
 * saving the customer never receives. If the code does not exist the cart
 * rejects it and the UI falls back to showing no break — never a phantom one.
 */
export interface QuantityBreak {
  minQuantity: number;
  percentOff: number;
  code: string;
  label: string;
}

export const QUANTITY_BREAKS = {
  /**
   * Off. With this false `breakFor` returns null, so the cart applies no
   * volume code and the discount sync clears any that is already on it —
   * the feature is inert rather than merely hidden.
   *
   * The tiers below are kept as configuration for whenever it comes back. To
   * switch it on: create the matching codes in Shopify with their minimum
   * quantities, flip this to true, and render <QuantityBreaks /> in the buy
   * box (see git history for the component).
   */
  enabled: false,
  heading: "Buy more, pay less",
  tiers: [
    { minQuantity: 2, percentOff: 5, code: "BULK5", label: "2+ units" },
    { minQuantity: 3, percentOff: 10, code: "BULK10", label: "3+ units" },
    { minQuantity: 5, percentOff: 15, code: "BULK15", label: "5+ units" },
  ] as QuantityBreak[],
} as const;

/** Deepest tier the quantity qualifies for, or null. */
export function breakFor(quantity: number): QuantityBreak | null {
  if (!QUANTITY_BREAKS.enabled) return null;
  let best: QuantityBreak | null = null;
  for (const tier of QUANTITY_BREAKS.tiers) {
    if (quantity >= tier.minQuantity && (!best || tier.minQuantity > best.minQuantity)) {
      best = tier;
    }
  }
  return best;
}

/* --------------------------------- Buy now -------------------------------- */

export const BUY_NOW = {
  enabled: true,
  label: "Buy it now",
} as const;

/* --------------------------------- Popups --------------------------------- */

export type PopupTrigger = "exit" | "delay" | "scroll";

export const POPUP = {
  enabled: true,
  /** exit  — pointer leaves the viewport (desktop) or a fast upward flick (touch).
   *  delay — after `delaySeconds`.
   *  scroll — after `scrollPercent` of the page. */
  trigger: "exit" as PopupTrigger,
  delaySeconds: 25,
  scrollPercent: 55,

  /** Suppressed for this many days after a dismissal or a conversion. */
  rememberDays: 7,
  storageKey: "sp-popup-seen",

  heading: "Before you go",
  body: "The pair works out at $23.99 a massager against $34.99 bought singly — the biggest saving on the store.",
  cta: "See the pair",
  dismiss: "No thanks",
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
