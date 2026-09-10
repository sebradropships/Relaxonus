/**
 * The Meta Pixel global, installed by components/MetaPixel.tsx.
 *
 * fbq exists only in the browser, and only after the base code has run (just
 * after hydration). Call it from event handlers or effects, never during render.
 */

export type MetaPixelStandardEvent =
  | "AddPaymentInfo"
  | "AddToCart"
  | "AddToWishlist"
  | "CompleteRegistration"
  | "Contact"
  | "CustomizeProduct"
  | "Donate"
  | "FindLocation"
  | "InitiateCheckout"
  | "Lead"
  | "PageView"
  | "Purchase"
  | "Schedule"
  | "Search"
  | "StartTrial"
  | "SubmitApplication"
  | "Subscribe"
  | "ViewContent";

export interface MetaPixelEventParams {
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: "product" | "product_group";
  contents?: { id: string; quantity: number; item_price?: number }[];
  num_items?: number;
  [param: string]: unknown;
}

/** eventID deduplicates a browser event against the same event sent server-side. */
export interface MetaPixelEventOptions {
  eventID?: string;
}

export interface MetaPixel {
  (command: "init", pixelId: string, advancedMatching?: Record<string, string>): void;
  /** Standard events only, so a misspelled name fails to compile. Anything else goes through trackCustom. */
  (
    command: "track",
    event: MetaPixelStandardEvent,
    params?: MetaPixelEventParams,
    options?: MetaPixelEventOptions,
  ): void;
  (
    command: "trackCustom",
    event: string,
    params?: Record<string, unknown>,
    options?: MetaPixelEventOptions,
  ): void;
  (command: "consent", action: "grant" | "revoke"): void;
}

declare global {
  interface Window {
    fbq: MetaPixel;
  }
  // Also allows the bare fbq(...) form that Meta's docs use.
  var fbq: MetaPixel;
}
