/**
 * Review data layer.
 *
 * The page renders whatever this returns and nothing more. Today it returns an
 * empty set, because the store has no orders and therefore no reviews — the UI
 * has an honest zero-state for exactly that case.
 *
 * When a review app is installed it writes to Shopify's standard metafields
 * (`reviews.rating`, `reviews.rating_count`), which the Storefront API can
 * read. Point `loadReviews` at that source and the whole section lights up
 * with no component changes.
 *
 * The one thing that must never happen here: returning invented reviews.
 * Fabricated consumer reviews are unlawful under 16 CFR Part 465.
 */

export interface Review {
  id: string;
  /** 1–5. */
  rating: number;
  title: string;
  body: string;
  /** Display name of the reviewer, as they gave it. */
  author: string;
  /** ISO date. */
  date: string;
  /** True only when the platform verified this person bought the product. */
  verifiedBuyer: boolean;
  /**
   * Where the review came from. Anything other than "store" MUST be shown to
   * the customer — reviews collected elsewhere cannot be presented as though
   * they came from your own buyers.
   */
  source: "store" | "supplier" | "marketplace";
  /** Required whenever `source` is not "store". */
  sourceLabel?: string;
}

export interface RatingSummary {
  /** Mean rating, or null when there is nothing to average. */
  average: number | null;
  /** Total number of ratings. */
  count: number;
  /** Count per star, index 0 = 1★ … index 4 = 5★. */
  distribution: [number, number, number, number, number];
}

export interface ReviewData {
  summary: RatingSummary;
  reviews: Review[];
}

export const EMPTY_REVIEWS: ReviewData = {
  summary: { average: null, count: 0, distribution: [0, 0, 0, 0, 0] },
  reviews: [],
};

/** Derives the summary from the reviews themselves, so the two cannot disagree. */
export function summarise(reviews: Review[]): RatingSummary {
  if (reviews.length === 0) return EMPTY_REVIEWS.summary;

  const distribution: [number, number, number, number, number] = [0, 0, 0, 0, 0];
  let total = 0;

  for (const review of reviews) {
    const star = Math.max(1, Math.min(5, Math.round(review.rating)));
    distribution[star - 1] += 1;
    total += review.rating;
  }

  return {
    average: Number((total / reviews.length).toFixed(1)),
    count: reviews.length,
    distribution,
  };
}

/**
 * Single entry point for the page.
 *
 * Returns an empty set until a real review source is connected. It is
 * deliberately not possible to seed this with sample content.
 */
export async function loadReviews(): Promise<ReviewData> {
  return EMPTY_REVIEWS;
}
