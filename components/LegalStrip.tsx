"use client";

import { useProduct } from "@/components/ProductProvider";
import { LEGAL } from "@/lib/product";

/**
 * The required disclosures, on their own rather than inside a purchase panel.
 *
 * They lived in the closing section until that was removed; they are not
 * decoration that goes with it. The device disclaimer is what keeps a comfort
 * accessory from reading as a treatment, and the pricing sentence is the
 * substantiation every strikethrough on the page rests on (16 CFR 233).
 *
 * The pricing line is derived from live Shopify money, never written down —
 * a hardcoded one went stale the moment prices changed and sat there
 * contradicting the figures beside it.
 */
export function LegalStrip() {
  const { amountFor, compareAtFor } = useProduct();

  const money = (value: number) => `$${value.toFixed(2)}`;
  const twoSingles = amountFor("blue") + amountFor("pink");
  const singleCompareAt = compareAtFor("blue");

  const pricing =
    `The Duo is ${money(amountFor("set"))} against the ${money(twoSingles)} that two single ` +
    `massagers cost at their current price.` +
    (singleCompareAt
      ? ` Blue and Pink are ${money(amountFor("blue"))} against a ${singleCompareAt} compare-at price.`
      : "");

  return (
    <footer className="border-t border-line py-10">
      <div className="shell max-w-3xl">
        <p className="disclosure">{LEGAL.disclaimer}</p>
        <p className="disclosure mt-2">
          {pricing} {LEGAL.shipping}
        </p>
        <p className="disclosure mt-4 text-faint">{LEGAL.copyright}</p>
      </div>
    </footer>
  );
}
