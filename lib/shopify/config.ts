/**
 * Shopify Storefront constants. No secrets — safe to import anywhere.
 *
 * Verified against the live store: the only market on this shop is the
 * United States, and the only published locale is English.
 */

import type { VariantKey } from "@/lib/product";

export const COUNTRY = "US" as const;
export const LANGUAGE = "EN" as const;

/** Pinned on both server and client so Intl output cannot hydration-mismatch. */
export const MONEY_LOCALE = "en-US";

/** Holds the full cart id, including its `?key=` query string. */
export const CART_COOKIE = "cart";
export const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/** How long live pricing may be served from cache. */
export const PRODUCT_REVALIDATE_SECONDS = 900;
export const PRODUCT_CACHE_TAG = "product";

/** Exact Shopify option values for the `Color` option — casing matters. */
export const OPTION_VALUE_BY_KEY: Record<VariantKey, string> = {
  blue: "Blue",
  pink: "Pink",
  set: "A set",
};

/** Normalised Shopify option value → app key. Compare lowercased and trimmed. */
export const KEY_BY_OPTION_VALUE: Record<string, VariantKey> = {
  blue: "blue",
  pink: "pink",
  "a set": "set",
};
