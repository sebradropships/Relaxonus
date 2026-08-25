import Image from "next/image";

import { LIFESTYLE } from "@/lib/product";

/**
 * No gradient scrim. The copy sits on a solid block, so contrast is
 * structurally guaranteed and does not need rechecking when the photo changes.
 */
export function Lifestyle() {
  return (
    <section className="relative border-y-[3px] border-sp-black">
      <div className="relative aspect-[4/5] md:aspect-auto md:h-[70vh]">
        <Image
          src={LIFESTYLE.image.url}
          alt={LIFESTYLE.image.alt}
          fill
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
      </div>

      <div className="sp-shell relative md:absolute md:inset-x-0 md:bottom-16">
        <div
          className="-mt-10 border-[3px] border-sp-black bg-sp-deep p-8 md:-mt-0 md:max-w-2xl"
          style={{ rotate: "0deg" }}
        >
          <p className="sp-mono text-[13px] text-sp-paper">{LIFESTYLE.eyebrow}</p>
          <h2 className="mt-3 text-[length:var(--text-display-m)] text-sp-paper">
            {LIFESTYLE.heading}
          </h2>
          <p className="mt-3 text-lg text-sp-paper">{LIFESTYLE.line}</p>
        </div>
      </div>
    </section>
  );
}
