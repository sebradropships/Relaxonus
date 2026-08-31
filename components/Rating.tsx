import { getReviews, reviewStats } from "@/lib/reviews";

/**
 * Five stars with a partial fill by width, so 4.8 does not draw identically
 * to 4.75. Decorative on its own — callers supply the spoken form.
 */
export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const fill = `${Math.max(0, Math.min(1, value / 5)) * 100}%`;

  return (
    <span
      aria-hidden="true"
      className="relative inline-block whitespace-nowrap leading-none"
      style={{ fontSize: size }}
    >
      <span className="text-line-strong">★★★★★</span>
      <span
        className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-accent"
        style={{ width: fill }}
      >
        ★★★★★
      </span>
    </span>
  );
}

/**
 * Aggregate rating for the hero, derived from the review data and nothing
 * else. There is deliberately no prop to pass a rating in: the number is
 * always the mean of what is actually there, so it cannot drift from the
 * reviews it summarises. Renders nothing when there are none.
 */
export function Rating({ className = "" }: { className?: string }) {
  const stats = reviewStats(getReviews());
  if (stats.count === 0) return null;

  const rounded = Math.round(stats.average * 10) / 10;

  return (
    <a
      href="#reviews"
      className={`tap inline-flex items-center gap-1.5 rounded transition-opacity hover:opacity-75 ${className}`}
    >
      <Stars value={stats.average} size={14} />
      <span className="num text-[12px] font-semibold text-ink">{rounded.toFixed(1)}</span>
      <span className="num text-[12px] text-muted underline underline-offset-2">
        ({stats.count})
      </span>
      <span className="sr-only">
        {rounded.toFixed(1)} out of 5, from {stats.count}{" "}
        {stats.count === 1 ? "review" : "reviews"}. Jump to reviews.
      </span>
    </a>
  );
}
