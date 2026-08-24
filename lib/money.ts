import { MONEY_LOCALE } from "@/lib/shopify/config";
import type { Money } from "@/lib/shopify/types";

/**
 * Formats Shopify money for display.
 *
 * The locale is pinned rather than taken from the visitor, because the server
 * and the client must produce byte-identical output or React reports a
 * hydration mismatch.
 */
export function formatMoney(money: Money): string {
  const amount = Number.parseFloat(money.amount);

  if (!Number.isFinite(amount)) return money.amount;

  return new Intl.NumberFormat(MONEY_LOCALE, {
    style: "currency",
    currency: money.currencyCode,
    // Shopify sends "30.0"; shoppers expect "$30.00".
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
