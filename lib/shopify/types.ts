import type { VariantKey } from "@/lib/product";

/** MoneyV2.amount is the Decimal scalar — always a string ("30.00"), never a number. */
export interface Money {
  amount: string;
  currencyCode: string;
}

export interface CartLineImage {
  url: string;
  altText: string | null;
}

/** One line in the cart drawer. Carries only what the drawer renders. */
export interface CartLine {
  id: string;
  quantity: number;
  title: string;
  /** The selected Color option value, or the variant title as a fallback. */
  variantLabel: string;
  image: CartLineImage | null;
  unitPrice: Money;
  lineTotal: Money;
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
  subtotal: Money;
  total: Money;
  lines: CartLine[];
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
