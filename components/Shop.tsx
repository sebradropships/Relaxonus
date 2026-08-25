"use client";

import Image from "next/image";

import { useProduct } from "@/components/ProductProvider";
import {
  BASIS_TAG,
  SHOP_CARDS,
  SHOP_HEADING,
  STRIKE_SR_PREFIX,
  VARIANTS,
} from "@/lib/product";

export function Shop() {
  const { selectVariant, addToCart, priceFor, compareAtFor, pending } = useProduct();

  return (
    <section id="shop" className="sp-section">
      <div className="sp-shell">
        <h2 className="text-[length:var(--text-display-l)] text-sp-paper">{SHOP_HEADING}</h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SHOP_CARDS.map((card) => {
            const option = VARIANTS[card.key];
            const compareAt = compareAtFor(card.key);
            const featured = Boolean(card.badge);

            return (
              <div
                key={card.key}
                className={`sp-card sp-lift relative flex flex-col border-[3px] bg-sp-carbon p-6 sp-hard-pink ${
                  featured ? "border-sp-chlorine" : "border-sp-paper"
                }`}
              >
                {card.badge && (
                  <span
                    className="sp-sticker sp-display absolute -top-4 left-4 z-10 max-w-[calc(100%-2rem)] border-[3px] border-sp-black bg-sp-bubblegum px-3 py-1.5 text-xs text-sp-ink"
                    style={{ animationDelay: "260ms" }}
                  >
                    {card.badge}
                  </span>
                )}

                <div
                  className="relative aspect-square border-[3px] border-sp-black"
                  style={{ background: option.panel }}
                >
                  <Image
                    src={option.frames[0].url}
                    alt={option.frames[0].alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="object-cover"
                  />
                </div>

                <h3 className="mt-5 text-[length:var(--text-display-s)] text-sp-paper">
                  <span aria-hidden="true">{card.emoji} </span>
                  {card.title}
                </h3>
                <p className="mt-2 text-[15px] text-sp-paper">{card.sub}</p>

                <div className="mt-4 flex items-baseline gap-3">
                  {compareAt && (
                    <>
                      <span className="sr-only">{STRIKE_SR_PREFIX}</span>
                      <s className="sp-strike sp-num text-lg text-sp-mist">{compareAt}</s>
                    </>
                  )}
                  <span className="sp-display sp-num text-3xl text-sp-paper">
                    {priceFor(card.key)}
                  </span>
                </div>
                {compareAt && (
                  <span aria-hidden="true" className="sp-disclosure text-[12px] text-sp-mist">
                    {BASIS_TAG}
                  </span>
                )}
                <span className="sp-mono mt-1 block text-[13px] text-sp-mist">{card.perUnit}</span>

                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    selectVariant(card.key);
                    addToCart();
                  }}
                  className="sp-squeeze sp-display mt-6 w-full border-[3px] border-sp-black bg-sp-bubblegum px-4 py-4 text-base text-sp-ink disabled:cursor-wait"
                >
                  {card.cta} — {priceFor(card.key)}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
