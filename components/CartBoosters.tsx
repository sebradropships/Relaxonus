"use client";

import { useProduct } from "@/components/ProductProvider";
import { SHIPPING, UPSELL } from "@/lib/campaign";
import { formatMoney } from "@/lib/money";
import { VARIANTS } from "@/lib/product";

/**
 * Free-shipping progress.
 *
 * Reads the live cart subtotal, so the bar and the remaining figure can never
 * disagree with the total printed beneath them. Renders nothing when the offer
 * is switched off in config.
 */
export function ShippingProgress() {
  const { subtotal } = useProduct();
  if (!SHIPPING.enabled || !subtotal) return null;

  const amount = Number.parseFloat(subtotal.amount);
  if (!Number.isFinite(amount)) return null;

  const target = SHIPPING.freeThreshold;
  const remaining = Math.max(0, target - amount);
  const pct = Math.min(100, (amount / target) * 100);
  const unlocked = remaining <= 0;
  const currency = subtotal.currencyCode;

  return (
    <div className="border-b border-line px-5 py-3">
      <p className="flex items-center gap-2 text-[13px] font-medium text-ink">
        {unlocked ? (
          <>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0 text-accent">
              <path d="M4.5 10.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {SHIPPING.labels.unlocked}
          </>
        ) : (
          SHIPPING.labels.progress(formatMoney({ amount: remaining.toFixed(2), currencyCode: currency }))
        )}
      </p>

      <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-line">
        <span
          className="block h-full rounded-full bg-accent transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </span>
    </div>
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
