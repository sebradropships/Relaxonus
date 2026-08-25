"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { AddToCartButton, CartError } from "@/components/AddToCartButton";
import { useProduct } from "@/components/ProductProvider";
import { BASIS_TAG, STICKY_OFFSET, STRIKE_SR_PREFIX, TIERS, VARIANTS } from "@/lib/product";

/**
 * The bar is glued to the viewport and is frequently the only price context a
 * mobile visitor can see, so it carries the strikethrough basis too — always
 * visible, never truncated.
 */
export function StickyBar() {
  const { heroRef, variant, priceFor, compareAtFor, quantity } = useProduct();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    /* Pulling the root's top edge down means the hero stops intersecting
       exactly when its bottom crosses that line — no scroll listener. */
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: `-${STICKY_OFFSET}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroRef]);

  if (!visible) return null;

  const option = VARIANTS[variant];
  const compareAt = compareAtFor(variant);

  return (
    <div className="sp-bar fixed inset-x-0 bottom-0 z-50 border-t-[3px] border-sp-bubblegum bg-sp-black min-[900px]:hidden">
      <div className="px-4 pb-2 pt-2">
        <CartError decorative />
      </div>

      <div className="flex items-center gap-3 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <span
          className="relative size-11 shrink-0 border-2 border-sp-paper"
          style={{ background: option.panel }}
        >
          <Image src={option.frames[0].url} alt="" fill sizes="44px" className="object-cover" />
        </span>

        <span className="min-w-0 flex-1">
          {/* Quantity is shown here too — the stepper lives in the buy box,
              which is off screen whenever this bar exists. */}
          <span className="sp-mono block truncate text-xs text-sp-mist">
            {quantity > 1 && `${quantity} × `}
            {TIERS[variant].title}
          </span>
          <span className="flex items-baseline gap-2">
            {compareAt && (
              <>
                <span className="sr-only">{STRIKE_SR_PREFIX}</span>
                <s className="sp-strike sp-num text-[13px] text-sp-mist">{compareAt}</s>
              </>
            )}
            <span className="sp-display sp-num text-xl text-sp-paper">{priceFor(variant)}</span>
          </span>
          {compareAt && (
            <span aria-hidden="true" className="sp-disclosure block text-xs text-sp-mist">
              {BASIS_TAG}
            </span>
          )}
        </span>

        <div className="w-auto shrink-0">
          <AddToCartButton compact className="!w-auto" />
        </div>
      </div>
    </div>
  );
}
