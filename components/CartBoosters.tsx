"use client";

import { FreeShipping } from "@/components/FreeShipping";
import { useProduct } from "@/components/ProductProvider";
import { SHIPPING, UPSELL } from "@/lib/campaign";
import { formatMoney } from "@/lib/money";
import { VARIANTS } from "@/lib/product";

/**
 * Free-shipping confirmation at the top of the cart.
 *
 * This used to be a progress bar toward a $60 threshold. Shopify charges
 * nothing for shipping at any order size, so "you're $25.01 away from free
 * shipping" was telling a shopper with one massager that they would pay for it.
 */
export function ShippingNotice() {
  if (!SHIPPING.free) return null;

  return (
    <p className="border-b border-line bg-accent-soft px-5 py-3">
      <FreeShipping label={SHIPPING.labels.cart} iconSize={16} className="text-[13px]" />
    </p>
  );
}

/**
 * Cart upsell.
 *
 * Offered only when the cart holds a single-massager option and no pair
 * already, and the saving is computed from live Shopify money rather than
 * written down — so it cannot claim a discount the prices do not support.
 * Adds the Duo rather than swapping, leaving the shopper in control of what
 * they keep.
 */
export function CartUpsell() {
  const { lines, amountFor, selectVariant, addToCart, pending } = useProduct();
  if (!UPSELL.enabled) return null;

  const labels = lines.map((line) => line.variantLabel.trim().toLowerCase());
  const target = VARIANTS[UPSELL.toVariant];
  const alreadyHasPair = labels.includes(target.optionValue.toLowerCase());
  const hasSingle = UPSELL.fromVariants.some((key) =>
    labels.includes(VARIANTS[key].optionValue.toLowerCase()),
  );

  if (alreadyHasPair || !hasSingle) return null;

  const twoSingles = amountFor("blue") + amountFor("pink");
  const saving = twoSingles - amountFor(UPSELL.toVariant);
  if (saving <= 0) return null;

  const currency = "USD";
  const savingText = formatMoney({ amount: saving.toFixed(2), currencyCode: currency });

  return (
    <div className="border-b border-line bg-sand px-5 py-4">
      <p className="text-[14px] font-semibold text-ink">{UPSELL.heading}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">{UPSELL.body(savingText)}</p>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          selectVariant(UPSELL.toVariant);
          addToCart();
        }}
        className="btn btn-quiet tap mt-3 w-full px-4 py-2.5 text-[13px]"
      >
        {UPSELL.cta} · {formatMoney({ amount: amountFor(UPSELL.toVariant).toFixed(2), currencyCode: currency })}
      </button>
    </div>
  );
}
