import type { VariantKey } from "@/lib/product";

/** MoneyV2.amount is the Decimal scalar — always a string ("30.00"), never a number. */
export interface Money {
  amount: string;
  currencyCode: string;
}

/**
 * What the client is allowed to know about the cart.
 *
 * Deliberately excludes the cart id: that lives in an httpOnly cookie so the
 * browser cannot read or forge it.
 */
export interface CartSummary {
  totalQuantity: number;
  checkoutUrl: string;
}

/** Live pricing for one option, merged over the curated copy at render time. */
export interface VariantCommerce {
  merchandiseId: string;
  price: Money;
  compareAtPrice: Money | null;
  availableForSale: boolean;
}

export interface ProductCommerce {
  /** Null when Shopify could not be reached — the page falls back to static copy. */
  variants: Record<VariantKey, VariantCommerce> | null;
  availableForSale: boolean;
}
