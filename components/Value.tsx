import Image from "next/image";

import { Demo } from "@/components/Demo";
import { REVIEWS_EMPTY, VALUE } from "@/lib/product";

/* Line icons, one stroke weight, no fill — they label the card, not decorate it. */
function Icon({ name }: { name: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--color-accent)",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "plug") {
    return (
      <svg {...common}>
        <path d="M9 3v5M15 3v5M6.5 8h11v3a5.5 5.5 0 0 1-11 0V8ZM12 16.5V21" />
        <path d="m4 4 16 16" stroke="var(--color-accent)" />
      </svg>
    );
  }
  if (name === "grip") {
    return (
      <svg {...common}>
        <path d="M8 11V5.5a1.5 1.5 0 0 1 3 0V11M11 10.5V4.8a1.5 1.5 0 0 1 3 0V11M14 10.5V6.3a1.5 1.5 0 0 1 3 0V13" />
        <path d="M8 11V9a1.5 1.5 0 0 0-3 0v5.5a6.5 6.5 0 0 0 12 4.2" />
      </svg>
    );
  }
  if (name === "rollers") {
    return (
      <svg {...common}>
        <circle cx="8.5" cy="6.5" r="2.6" />
        <circle cx="15.5" cy="6.5" r="2.6" />
        <circle cx="8.5" cy="12" r="2.6" />
        <circle cx="15.5" cy="12" r="2.6" />
        <circle cx="8.5" cy="17.5" r="2.6" />
        <circle cx="15.5" cy="17.5" r="2.6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 3c0 3.5-4 5.5-4 9a4 4 0 0 0 8 0c0-3.5-4-5.5-4-9Z" />
      <path d="M5 20h14" />
    </svg>
  );
}

/**
 * SECTION 2 — turns curiosity into wanting it: the demonstration, the four
 * reasons, the mechanism diagrams, and the questions people ask before buying.
 *
 * Reviews live in their own <Reviews> section below this one.
 */
export function Value() {
  return (
    <section id="why" className="border-y border-line bg-sand py-16 sm:py-24">
      <div className="shell">
        {/* The demonstration leads the section: seeing it used is the fastest
            way to understand it, and it earns the copy underneath. */}
        <Demo />

        <p className="eyebrow mt-16 text-accent">{VALUE.eyebrow}</p>
        <h2 className="mt-3 max-w-[18ch] text-[length:var(--text-h2)] text-ink">
          {VALUE.heading}
        </h2>
        <p className="mt-4 max-w-[54ch] text-[17px] leading-relaxed text-muted">{VALUE.deck}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE.cards.map((card) => (
            <div key={card.title} className="card p-6">
              <Icon name={card.icon} />
              <h3 className="mt-4 text-[length:var(--text-h3)] text-ink">{card.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{card.body}</p>
            </div>
          ))}
        </div>

        {/* Proof and objections, side by side on desktop — the two things a
            hesitating visitor is actually looking for. */}
        <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="card overflow-hidden">
            {/* `contain: paint` rather than overflow alone: an animated,
                translated child inside plain overflow:hidden is the shape
                WebKit fails to clip. */}
            <div className="relative aspect-[16/11] overflow-hidden [contain:paint]">
              <div className="slide-pair flex h-full w-[200%]">
                {VALUE.mechanism.map((frame) => (
                  <div key={frame.url} className="relative h-full w-1/2">
                    <Image
                      src={frame.url}
                      alt={frame.alt}
                      fill
                      sizes="(max-width: 1023px) 100vw, 560px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-line">
              {REVIEWS_EMPTY.proof.map(([value, label]) => (
                <div key={label} className="bg-surface px-5 py-4">
                  <span className="display num block text-2xl text-ink">{value}</span>
                  <span className="mt-0.5 block text-[13px] leading-tight text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 sm:p-7">
            <h3 className="text-[length:var(--text-h3)] text-ink">Before you ask</h3>
            <dl className="mt-4">
              {VALUE.objections.map((item, index) => (
                <div
                  key={item.q}
                  className={index > 0 ? "mt-4 border-t border-line pt-4" : undefined}
                >
                  <dt className="text-[15px] font-semibold text-ink">{item.q}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-muted">{item.a}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 border-t border-line pt-5">
              <h3 className="text-[length:var(--text-h3)] text-ink">{VALUE.spec.heading}</h3>
              <dl className="mt-3 grid gap-y-2">
                {VALUE.spec.items.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 text-[15px]">
                    <dt className="text-muted">{label}</dt>
                    <dd className="text-right font-medium text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
