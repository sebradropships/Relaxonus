import { FEATURES, type Feature } from "@/lib/product";

import styles from "./Marketing.module.css";

function FeatureIcon({ icon }: { icon: Feature["icon"] }) {
  switch (icon) {
    case "target":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      );
    case "square":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "diamond":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="12"
            y="2"
            width="13"
            height="13"
            rx="3"
            transform="rotate(45 12 2)"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      );
    case "rings":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="8" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="16" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
}

export function Features() {
  return (
    <section className="shell section section-sm">
      <div className={styles.featureGrid}>
        {FEATURES.map((feature) => (
          <div key={feature.title} className={`card ${styles.feature}`}>
            <span
              className={`icon ${feature.tone === "blue" ? "icon-blue" : "icon-pink"}`}
              aria-hidden="true"
            >
              <FeatureIcon icon={feature.icon} />
            </span>
            <span className={styles.featureTitle}>{feature.title}</span>
            <span className={styles.featureBody}>{feature.body}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
