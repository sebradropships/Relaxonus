"use server";

import { TIER_ORDER, type VariantKey } from "@/lib/product";
import { addLine, getCart, type AddResult } from "@/lib/shopify/cart";
import { getProductCommerce, merchandiseIdFor } from "@/lib/shopify/product";
import type { CartSummary } from "@/lib/shopify/types";

function isVariantKey(value: unknown): value is VariantKey {
  return typeof value === "string" && (TIER_ORDER as string[]).includes(value);
}

/**
 * Adds one unit of the chosen option to the Shopify cart.
 *
 * The variant key is validated here rather than trusted: a server action is a
 * public HTTP endpoint, so its arguments arrive from the network and can be
 * anything at all.
 */
export async function addToCartAction(key: unknown): Promise<AddResult> {
  if (!isVariantKey(key)) {
    return { ok: false, cart: null, error: "Unknown product option." };
  }

  const commerce = await getProductCommerce();
  const merchandiseId = merchandiseIdFor(key, commerce);

  if (commerce.variants && !commerce.variants[key].availableForSale) {
    return { ok: false, cart: null, error: "That option is currently sold out." };
  }

  return addLine(merchandiseId, 1);
}

/** Rehydrates the cart badge on load, so a returning shopper keeps their cart. */
export async function getCartAction(): Promise<CartSummary | null> {
  return getCart();
}
