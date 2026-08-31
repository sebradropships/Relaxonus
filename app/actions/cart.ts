"use server";

import { QUANTITY_BREAKS } from "@/lib/campaign";
import { MAX_QUANTITY, TIER_ORDER, type VariantKey } from "@/lib/product";
import {
  addLine,
  getCart,
  removeLine,
  setDiscountCodes,
  updateLineQuantity,
  type AddResult,
  type LineResult,
} from "@/lib/shopify/cart";
import { getProductCommerce, merchandiseIdFor } from "@/lib/shopify/product";
import type { CartSummary } from "@/lib/shopify/types";

function isVariantKey(value: unknown): value is VariantKey {
  return typeof value === "string" && (TIER_ORDER as string[]).includes(value);
}

/**
 * Clamps to a whole number in range.
 *
 * A server action is a public HTTP endpoint — its arguments arrive over the
 * network and can be anything, including 0, -3, 1e9 or "2". None of those may
 * reach Shopify.
 */
function safeQuantity(value: unknown): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return 1;
  return Math.min(Math.max(n, 1), MAX_QUANTITY);
}

export async function addToCartAction(key: unknown, quantity: unknown = 1): Promise<AddResult> {
  if (!isVariantKey(key)) {
    return { ok: false, cart: null, error: "Unknown product option." };
  }

  const commerce = await getProductCommerce();
  const merchandiseId = merchandiseIdFor(key, commerce);

  if (commerce.variants && !commerce.variants[key].availableForSale) {
    return { ok: false, cart: null, error: "That option is currently sold out." };
  }

  return addLine(merchandiseId, safeQuantity(quantity));
}

/** Rehydrates the cart badge on load, so a returning shopper keeps their cart. */
export async function getCartAction(): Promise<CartSummary | null> {
  return getCart();
}

/**
 * Sets one cart line to an exact quantity, clamped to the same 1–MAX_QUANTITY
 * range the buy-box stepper enforces. A requested quantity below 1 means
 * "remove this line" — Shopify's own line-update mutation does not accept 0.
 */
export async function updateLineQuantityAction(
  lineId: unknown,
  quantity: unknown,
): Promise<LineResult> {
  if (typeof lineId !== "string" || lineId.length === 0) {
    return { ok: false, cart: null, error: "Unknown cart line." };
  }

  const requested = Math.floor(Number(quantity));
  if (!Number.isFinite(requested) || requested < 1) {
    return removeLine(lineId);
  }

  return updateLineQuantity(lineId, Math.min(requested, MAX_QUANTITY));
}

export async function removeLineAction(lineId: unknown): Promise<LineResult> {
  if (typeof lineId !== "string" || lineId.length === 0) {
    return { ok: false, cart: null, error: "Unknown cart line." };
  }

  return removeLine(lineId);
}

/**
 * Applies volume-discount codes to the cart.
 *
 * Codes are validated against the configured tiers rather than trusted from
 * the client: a server action is a public endpoint, and without this check any
 * caller could apply any discount code the store has ever created.
 */
export async function setDiscountCodesAction(codes: unknown): Promise<LineResult> {
  if (!Array.isArray(codes) || codes.some((c) => typeof c !== "string")) {
    return { ok: false, cart: null, error: "Unknown discount." };
  }

  const allowed = new Set(QUANTITY_BREAKS.tiers.map((tier) => tier.code));
  const safe = (codes as string[]).filter((code) => allowed.has(code));

  return setDiscountCodes(safe);
}
