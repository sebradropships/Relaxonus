"use client";

import { useProduct } from "@/components/ProductProvider";
import { BestValueSticker } from "@/components/SaleSticker";
import { BUY_NOW, QUANTITY_BREAKS, breakFor } from "@/lib/campaign";
import {
  MAX_QUANTITY,
  STRIKE_SR_PREFIX,
  TIER_ORDER,
  VARIANTS,
  type VariantKey,
} from "@/lib/product";

/* --------------------------------- Price ---------------------------------- */

/**
 * The price is the loudest thing on the page after the product itself.
 * A strikethrough renders only where a genuine reference price exists — for
 * the Duo, the real cost of two singles bought separately.
 */
export function PriceBlock({ compact = false }: { compact?: boolean }) {
  const { variant, priceFor, compareAtFor, amountFor, discountPercentFor } = useProduct();
  const compareAt = compareAtFor(variant);
  const percent = discountPercentFor(variant);
  const option = VARIANTS[variant];

  /* Every figure below is arithmetic on live Shopify money. The Duo's bundle
     line in particular has to be computed, not written down: the moment the
     singles are discounted, a hardcoded "two singles cost $59.98" becomes a
     false price comparison. */
  const unit = amountFor(variant) / option.units;
  const twoSingles = amountFor("blue") + amountFor("pink");
  const bundleSaving = twoSingles - amountFor("set");
  const money = (value: number) => `$${value.toFixed(2)}`;

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          className={`display num text-ink ${
            compact ? "text-2xl" : "text-[length:var(--text-price)] leading-none"
          }`}
        >
          {priceFor(variant)}
        </span>

        {compareAt && (
          <>
            <span className="sr-only">{STRIKE_SR_PREFIX}</span>
            <s className={`strike num text-faint ${compact ? "text-base" : "text-xl"}`}>
              {compareAt}
            </s>
            {percent !== null && (
              <span
                className={`num rounded-full bg-save-soft px-2.5 py-1 font-semibold text-save ${
                  compact ? "text-xs" : "text-sm"
                }`}
              >
                SAVE {percent}%
              </span>
            )}
          </>
        )}
      </div>

      {!compact && (
        <p className="disclosure mt-2">
          {option.units === 2
            ? `Two massagers — ${money(unit)} each. Bought separately they are ` +
              `${money(twoSingles)}, so the pair saves a further ${money(bundleSaving)}.`
            : "One massager. Shipping calculated at checkout."}
        </p>
      )}
    </div>
  );
}

/* ------------------------------ Variant picker ---------------------------- */

function Swatch({ variantKey }: { variantKey: VariantKey }) {
  return (
    <span
      aria-hidden="true"
      className="size-7 shrink-0 rounded-full border border-line-strong"
      style={{ background: VARIANTS[variantKey].swatch }}
    />
  );
}

/**
 * Two singles side by side, the Duo on its own full-width row so its genuine
 * saving has room to be stated rather than abbreviated into a sticker.
 */
export function VariantPicker() {
  const { variant, selectVariant, priceFor, compareAtFor, availableFor } = useProduct();

  const singles = TIER_ORDER.filter((key) => VARIANTS[key].units === 1);
  const duoSelected = variant === "set";
  const duoCompareAt = compareAtFor("set");

  return (
    <div role="radiogroup" aria-label="Choose your option">
      <div className="grid grid-cols-2 gap-2.5">
        {singles.map((key) => {
          const selected = key === variant;
          const soldOut = !availableFor(key);
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={soldOut}
              onClick={() => selectVariant(key)}
              className={`tap-lg flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                selected
                  ? "border-accent bg-accent-soft ring-1 ring-accent"
                  : "border-line bg-surface hover:border-line-strong"
              } ${soldOut ? "cursor-not-allowed opacity-45" : ""}`}
            >
              <Swatch variantKey={key} />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink">
                  {VARIANTS[key].short}
                </span>
                <span className="num flex items-baseline gap-1.5 text-xs">
                  <span className="text-muted">{priceFor(key)}</span>
                  {compareAtFor(key) && (
                    <s className="strike text-faint">{compareAtFor(key)}</s>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        role="radio"
        aria-checked={duoSelected}
        disabled={!availableFor("set")}
        onClick={() => selectVariant("set")}
        className={`tap-lg relative mt-2.5 flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
          duoSelected
            ? "border-accent bg-accent-soft ring-1 ring-accent"
            : "border-line bg-surface hover:border-line-strong"
        }`}
      >
        {/* Replaces the inline SAVE pill rather than joining it — the sticker
            lands in the same corner, and one badge stating the saving once is
            clearer than two stating it twice. */}
        <BestValueSticker />

        <Swatch variantKey="set" />
        {/* Right padding reserves the sticker's footprint so the copy cannot
            run underneath it on a narrow screen. */}
        <span className="min-w-0 flex-1 pr-14">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-semibold text-ink">Both — Blue + Pink</span>
          </span>
          <span className="num mt-0.5 flex items-baseline gap-1.5 text-xs">
            <span className="text-muted">{priceFor("set")}</span>
            {duoCompareAt && <s className="strike text-faint">{duoCompareAt}</s>}
          </span>
        </span>
      </button>
    </div>
  );
}

/* -------------------------------- Quantity -------------------------------- */

/**
 * Two 48px buttons around a live region rather than a number input: a native
 * spinner's arrows are far below a comfortable touch target, and its mobile
 * keyboard invites free text into a field that only accepts 1–10.
 */
export function QtyStepper() {
  const { quantity, setQuantity, pending } = useProduct();
  const atMin = quantity <= 1;
  const atMax = quantity >= MAX_QUANTITY;

  return (
    <div className="flex items-center gap-3">
      <span id="qty-label" className="text-sm font-medium text-muted">
        Quantity
      </span>
      <div className="flex items-stretch overflow-hidden rounded-xl border border-line-strong bg-surface">
        <button
          type="button"
          onClick={() => setQuantity(quantity - 1)}
          disabled={atMin || pending}
          aria-label="Decrease quantity"
          className="grid size-12 place-items-center text-xl leading-none text-ink transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:text-faint disabled:hover:bg-transparent"
        >
          <span aria-hidden="true">−</span>
        </button>
        <output
          htmlFor="qty-label"
          aria-live="polite"
          className="num grid w-12 place-items-center border-x border-line text-base font-semibold text-ink"
        >
          <span className="sr-only">Quantity: </span>
          {quantity}
        </output>
        <button
          type="button"
          onClick={() => setQuantity(quantity + 1)}
          disabled={atMax || pending}
          aria-label="Increase quantity"
          className="grid size-12 place-items-center text-xl leading-none text-ink transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:text-faint disabled:hover:bg-transparent"
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- Add to cart ------------------------------ */

/**
 * Always full width, never squeezed beside another control — a CTA that has
 * to share a flex row is the one that gets clipped on a 320px screen.
 */
export function AddToCart({ id }: { id?: string }) {
  const { added, pending, error, addToCart, variant, availableFor, priceFor } = useProduct();
  const soldOut = !availableFor(variant);

  const label = soldOut
    ? "SOLD OUT"
    : pending
      ? "ADDING…"
      : added
        ? "ADDED ✓"
        : `ADD TO CART — ${priceFor(variant)}`;

  return (
    <button
      id={id}
      type="button"
      onClick={() => {
        if (pending || soldOut) return;
        addToCart();
      }}
      /* Sold out is permanent, so native `disabled` fits. Pending is transient,
         and disabling blurs the focused element mid-add, throwing keyboard
         focus to <body> and making aria-busy unannounceable. */
      disabled={soldOut}
      aria-disabled={pending || undefined}
      aria-busy={pending}
      aria-describedby={error ? "cart-error" : undefined}
      className="btn btn-primary tap-lg w-full px-6 py-4 text-base sm:text-lg"
    >
      {label}
    </button>
  );
}

/**
 * Buy now — adds the selection, then goes straight to Shopify checkout.
 *
 * Waits for the real checkout URL that the add returns rather than reusing a
 * stale one: the cart may not exist yet on a first click, and sending someone
 * to a checkout that predates their item is worse than a moment's wait.
 */
export function BuyNow() {
  const { buyNow, pending, variant, availableFor } = useProduct();
  if (!BUY_NOW.enabled) return null;

  const soldOut = !availableFor(variant);

  return (
    <button
      type="button"
      onClick={() => {
        if (pending || soldOut) return;
        buyNow();
      }}
      disabled={soldOut}
      aria-disabled={pending || undefined}
      className="btn btn-quiet tap-lg w-full px-6 py-3.5 text-[15px]"
    >
      {BUY_NOW.label}
    </button>
  );
}

/**
 * Volume pricing.
 *
 * Highlights the tier the current quantity qualifies for. The saving is only
 * ever claimed once the matching discount code has actually applied to the
 * cart, so the panel cannot promise a reduction the checkout will not honour.
 */
export function QuantityBreaks() {
  const { quantity, setQuantity } = useProduct();
  if (!QUANTITY_BREAKS.enabled || QUANTITY_BREAKS.tiers.length === 0) return null;

  const active = breakFor(quantity);

  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      <p className="text-[13px] font-semibold text-ink">{QUANTITY_BREAKS.heading}</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {QUANTITY_BREAKS.tiers.map((tier) => {
          const selected = active?.code === tier.code;
          return (
            <button
              key={tier.code}
              type="button"
              onClick={() => setQuantity(tier.minQuantity)}
              aria-pressed={selected}
              className={`tap rounded-lg border px-2 py-1.5 text-center transition-colors ${
                selected
                  ? "border-accent bg-accent-soft"
                  : "border-line hover:border-line-strong"
              }`}
            >
              <span className="num block text-[13px] font-semibold text-ink">
                −{tier.percentOff}%
              </span>
              <span className="block text-[11px] leading-tight text-muted">{tier.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Inline failure. Rendered in the buy box only, so it announces exactly once. */
export function CartError() {
  const { error } = useProduct();
  if (!error) return null;
  return (
    <p
      id="cart-error"
      role="alert"
      className="rounded-lg border border-save/30 bg-save-soft px-3 py-2 text-sm text-save"
    >
      {error}
    </p>
  );
}
