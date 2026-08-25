import { FEATURES, FEATURES_HEADING } from "@/lib/product";

export function Features() {
  return (
    <section id="rollers" className="sp-section">
      <div className="sp-shell">
        <h2 className="text-[length:var(--text-display-l)] text-sp-paper">{FEATURES_HEADING}</h2>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className={`sp-card sp-lift border-[3px] bg-sp-carbon p-7 sp-hard-pink ${
                feature.accent ? "border-sp-chlorine" : "border-sp-paper"
              }`}
            >
              <span aria-hidden="true" className="block text-5xl leading-none">
                {feature.emoji}
              </span>
              <h3 className="mt-5 text-[length:var(--text-display-s)] text-sp-paper">
                {feature.title}
              </h3>
              <p className="mt-2 text-[15px] leading-snug text-sp-paper">{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
