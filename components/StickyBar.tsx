"use client";

import { FreeShipping } from "@/components/FreeShipping";
import { useProduct } from "@/components/ProductProvider";
import { SHIPPING } from "@/lib/campaign";
import { STRIKE_SR_PREFIX, VARIANTS } from "@/lib/product";

/**
 * Mobile purchase bar.
 *
 * Appears only while the real buy box is off screen — duplicating a CTA the
 * shopper can already see is noise, and the brief is explicit that it should
 * hide then. Watches the buy box itself rather than the whole hero, so it
 * behaves the same however tall the section grows.
 */
export function StickyBar() {
  const {
    buyZoneVisible,
    variant,
    priceFor,
    compareAtFor,
    addToCart,
    pending,
    added,
    availableFor,
  } = useProduct();

  /* Both the hero buy box and the closing panel register as buy zones, so the
     bar stands down for either one. */
  if (buyZoneVisible) return null;

  const option = VARIANTS[variant];
  const compareAt = compareAtFor(variant);
  const soldOut = !availableFor(variant);

  return (
    <div className="fade fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md min-[900px]:hidden">
      <div className="flex items-center gap-3 px-4">
        <div className="min-w-0 flex-1">
          {/* Shares the name's line rather than adding one: a taller bar would
              outgrow the body padding that keeps it off the footer. The name
              is cut at its dash — "The Duo", not "The Duo — Blue + Pink" — and
              below 360px, where even that cannot sit beside the promise, it
              gives way entirely rather than truncating to a letter. */}
          <p className="flex min-w-0 items-center gap-1.5 text-[13px]">
            <span className={`truncate text-muted ${SHIPPING.free ? "max-[359px]:hidden" : ""}`}>
              {SHIPPING.free ? option.name.split(" — ")[0] : option.name}
            </span>
            {SHIPPING.free && (
              <>
                <span aria-hidden="true" className="text-faint max-[359px]:hidden">·</span>
                <FreeShipping
                  label={SHIPPING.labels.short}
                  iconSize={14}
                  className="shrink-0 text-[12px]"
                />
              </>
            )}
          </p>
          <p className="flex items-baseline gap-2">
            <span className="display num text-lg text-ink">{priceFor(variant)}</span>
            {compareAt && (
              <>
                <span className="sr-only">{STRIKE_SR_PREFIX}</span>
                <s className="strike num text-[13px] text-faint">{compareAt}</s>
              </>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (pending || soldOut) return;
            addToCart();
          }}
          disabled={soldOut}
          aria-disabled={pending || undefined}
          aria-busy={pending}
          className="btn btn-primary tap-lg shrink-0 px-5 py-3 text-[15px]"
        >
          {soldOut ? "SOLD OUT" : pending ? "ADDING…" : added ? "ADDED ✓" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
}
