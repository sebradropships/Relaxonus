"use client";

import Image from "next/image";

import { AddToCartButton, CartError, CheckoutLink } from "@/components/AddToCartButton";
import { useProduct } from "@/components/ProductProvider";
import { QuantityControl } from "@/components/QuantityControl";
import { TierSelector } from "@/components/TierSelector";
import { HERO, VARIANTS } from "@/lib/product";

function Sticker({
  children,
  tone,
  className,
  delay,
}: {
  children: string;
  tone: "pink" | "cyan";
  className: string;
  delay: number;
}) {
  return (
    <span
      className={`sp-sticker sp-display absolute z-10 border-[3px] border-sp-black px-3 py-1.5 text-sm text-sp-ink ${
        tone === "pink" ? "bg-sp-bubblegum" : "bg-sp-chlorine"
      } ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </span>
  );
}

export function Hero() {
  const { heroRef, variant, image, selectImage } = useProduct();
  const option = VARIANTS[variant];
  const current = option.frames[image] ?? option.frames[0];

  return (
    <section id="top" ref={heroRef} className="sp-shell pt-12 pb-16 md:pt-16">
      <p className="sp-mono text-[13px] text-sp-mist">{HERO.eyebrow}</p>

      {/* Full width above both columns so the buy box rides up and the primary
          CTA clears the fold. The words run inline on desktop — stacked, at
          display-xl, three lines of 140px push the CTA back below it. */}
      <h1 className="mt-3 text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.9] text-sp-paper">
        <span className="sr-only">{HERO.srTitle}</span>
        <span aria-hidden="true" className="flex flex-wrap gap-x-5">
          <span className="text-sp-chlorine">SQUEEZE.</span>
          <span className="text-sp-bubblegum">ROLL.</span>
          <span>AHHH.</span>
        </span>
      </h1>

      <p className="mt-5 max-w-[60ch] text-xl text-sp-paper">{HERO.deck}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Gallery */}
        <div>
          <div
            className="relative aspect-square border-[3px] border-sp-paper transition-[background] duration-300"
            style={{ background: option.panel, boxShadow: "8px 8px 0 var(--color-sp-bubblegum)" }}
          >
            <Sticker tone="pink" className="-left-2 top-4" delay={0}>
              {HERO.stickers[0]}
            </Sticker>
            <Sticker tone="cyan" className="-right-2 bottom-4" delay={700}>
              {HERO.stickers[1]}
            </Sticker>
            <Image
              key={current.url}
              src={current.url}
              alt={current.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-3">
            {option.frames.map((frame, index) => {
              const active = index === image;
              return (
                <button
                  key={frame.url}
                  type="button"
                  onClick={() => selectImage(index)}
                  aria-pressed={active}
                  aria-label={`View image ${index + 1}: ${frame.alt}`}
                  className={`relative aspect-square border-[3px] ${
                    active ? "border-sp-chlorine" : "border-sp-rule"
                  }`}
                  style={{ background: option.panel }}
                >
                  <Image src={frame.url} alt="" fill sizes="120px" className="object-cover" />
                  {/* Border hue alone would be a 1.4.1 failure. */}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-sp-chlorine text-[11px] font-black text-sp-ink"
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Buy box. Bullets sit below the CTA deliberately. */}
        <div
          className="border-[3px] border-sp-paper bg-sp-carbon p-6"
          style={{ boxShadow: "8px 8px 0 var(--color-sp-chlorine)" }}
        >
          <TierSelector />

          <QuantityControl className="mt-6" />

          <div className="mt-4 flex flex-col gap-3">
            <AddToCartButton />
            <CartError />
            <CheckoutLink />
          </div>

          <p className="sp-disclosure mt-4 text-sp-mist">{HERO.microline}</p>

          <ul className="mt-6 flex flex-col gap-3 border-t-[3px] border-sp-rule pt-6">
            {HERO.bullets.map((bullet) => (
              <li key={bullet.text} className="flex gap-3 text-[17px] leading-snug text-sp-paper">
                <span aria-hidden="true" className="shrink-0">
                  {bullet.emoji}
                </span>
                {bullet.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
