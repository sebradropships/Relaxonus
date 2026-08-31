import "server-only";

import { VARIANTS, TIER_ORDER, type VariantKey } from "@/lib/product";
import { isConfigured, storefrontCached } from "@/lib/shopify/client";
import {
  COUNTRY,
  KEY_BY_OPTION_VALUE,
  LANGUAGE,
  PRODUCT_CACHE_TAG,
  PRODUCT_REVALIDATE_SECONDS,
} from "@/lib/shopify/config";
import { PRODUCT_COMMERCE_QUERY, PRODUCT_INVENTORY_QUERY } from "@/lib/shopify/queries";
import type { Money, ProductCommerce, VariantCommerce } from "@/lib/shopify/types";

interface RawVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  sku: string | null;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: { name: string; value: string }[];
}

interface RawResponse {
  product: {
    id: string;
    handle: string;
    title: string;
    availableForSale: boolean;
    variants: { nodes: RawVariant[] };
  } | null;
}

/**
 * Live pricing and availability, keyed by the app's own variant keys.
 *
 * Mapping is by option value rather than variant title or array position:
 * Shopify returns option values in its own order ("A set", "Blue", "Pink"),
 * which is not the order the page displays them in.
 *
 * If Shopify is unreachable this returns `variants: null` and the page falls
 * back to the prices committed in lib/product.ts. A slow or failing Shopify
 * should degrade the page, not break it.
 */
export async function getProductCommerce(): Promise<ProductCommerce> {
  const handle = process.env.SHOPIFY_PRODUCT_HANDLE;

  if (!isConfigured() || !handle) {
    return { variants: null, availableForSale: true, inventory: null };
  }

  try {
    const data = await storefrontCached<RawResponse>(
      PRODUCT_COMMERCE_QUERY,
      { handle, country: COUNTRY, language: LANGUAGE },
      PRODUCT_REVALIDATE_SECONDS,
      [PRODUCT_CACHE_TAG],
    );

    if (!data.product) return { variants: null, availableForSale: true, inventory: null };

    const byKey = {} as Record<VariantKey, VariantCommerce>;

    for (const node of data.product.variants.nodes) {
      const colour = node.selectedOptions.find(
        (option) => option.name.trim().toLowerCase() === "color",
      );
      if (!colour) continue;

      const key = KEY_BY_OPTION_VALUE[colour.value.trim().toLowerCase()];
      if (!key) continue;

      byKey[key] = {
        merchandiseId: node.id,
        price: node.price,
        compareAtPrice: node.compareAtPrice,
        availableForSale: node.availableForSale,
      };
    }

    // Only trust the live data if every option we sell came back.
    const complete = TIER_ORDER.every((key) => byKey[key]);
    if (!complete) return { variants: null, availableForSale: data.product.availableForSale, inventory: null };

    return { variants: byKey, availableForSale: data.product.availableForSale, inventory: null };
  } catch {
    return { variants: null, availableForSale: true, inventory: null };
  }
}

/** The merchandise id to add for a given option, live where possible. */
export function merchandiseIdFor(key: VariantKey, commerce: ProductCommerce): string {
  return commerce.variants?.[key].merchandiseId ?? VARIANTS[key].variantId;
}

interface RawInventory {
  product: {
    variants: {
      nodes: { id: string; quantityAvailable: number | null; selectedOptions: { name: string; value: string }[] }[];
    };
  } | null;
}

/**
 * Live stock per variant, or null when it cannot be read.
 *
 * Returns null rather than throwing on ANY failure — most often a missing
 * `unauthenticated_read_product_inventory` scope, which Shopify reports as a
 * hard error. Callers render no stock line in that case rather than inventing
 * a number, so the feature simply switches itself on once the scope exists.
 */
export async function getInventory(): Promise<Record<VariantKey, number | null> | null> {
  const handle = process.env.SHOPIFY_PRODUCT_HANDLE;
  if (!isConfigured() || !handle) return null;

  try {
    const data = await storefrontCached<RawInventory>(
      PRODUCT_INVENTORY_QUERY,
      { handle, country: COUNTRY, language: LANGUAGE },
      /* Far shorter than the pricing window: a stock figure that lags is worse
         than none, since it is the one number a shopper may act on fast. */
      60,
      [PRODUCT_CACHE_TAG],
    );

    if (!data.product) return null;

    const byKey = {} as Record<VariantKey, number | null>;
    for (const node of data.product.variants.nodes) {
      const colour = node.selectedOptions.find(
        (option) => option.name.trim().toLowerCase() === "color",
      );
      if (!colour) continue;
      const key = KEY_BY_OPTION_VALUE[colour.value.trim().toLowerCase()];
      if (!key) continue;
      byKey[key] = node.quantityAvailable;
    }

    return Object.keys(byKey).length > 0 ? byKey : null;
  } catch {
    return null;
  }
}
