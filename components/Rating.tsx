import { REVIEWS } from "@/lib/product";

/**
 * Aggregate star rating, derived from REVIEWS and nothing else.
 *
 * It renders only when real reviews exist, and the number is always their
 * mean — there is no prop to pass a rating in, deliberately. A star rating is
 * among the strongest signals on the page, and a typed-in figure is a claim
 * about customers who have not said anything (16 CFR 465). Add genuine reviews
 * to REVIEWS and this appears on its own, already correct.
 */
export function Rating({ className = "" }: { className?: string }) {
  if (REVIEWS.length === 0) return null;

  const mean = REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length;
  const rounded = Math.round(mean * 10) / 10;
  /* Partial fill by width rather than by rounding to a half-star: 4.8 should
     not draw the same as 4.75. */
  const fill = `${(mean / 5) * 100}%`;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span aria-hidden="true" className="relative inline-block leading-none">
        <span className="text-line-strong">★★★★★</span>
        <span
          className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-accent"
          style={{ width: fill }}
        >
          ★★★★★
        </span>
      </span>
      <span className="num text-[12px] font-semibold text-ink">{rounded.toFixed(1)}</span>
      <span className="num text-[12px] text-muted">
        ({REVIEWS.length})
      </span>
      <span className="sr-only">
        {rounded.toFixed(1)} out of 5, from {REVIEWS.length}{" "}
        {REVIEWS.length === 1 ? "review" : "reviews"}.
      </span>
    </span>
  );
}
