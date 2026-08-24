import styles from "./Reviews.module.css";

const MAX = 5;

/**
 * Accessible star rating.
 *
 * The glyphs are decorative; the value is exposed to assistive technology as
 * text. Renders nothing when there is no rating — a zero-star row would read
 * as a bad rating rather than an absent one.
 */
export function Stars({
  value,
  size = "md",
  label,
}: {
  value: number | null;
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  if (value === null || Number.isNaN(value)) return null;

  const clamped = Math.max(0, Math.min(MAX, value));
  const pct = (clamped / MAX) * 100;

  return (
    <span
      className={`${styles.stars} ${styles[size]}`}
      role="img"
      aria-label={label ?? `Rated ${clamped.toFixed(1)} out of ${MAX}`}
    >
      <span className={styles.starsTrack} aria-hidden="true">
        ★★★★★
      </span>
      <span className={styles.starsFill} style={{ width: `${pct}%` }} aria-hidden="true">
        ★★★★★
      </span>
    </span>
  );
}
