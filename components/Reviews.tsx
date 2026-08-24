import { Stars } from "@/components/Stars";
import { loadReviews } from "@/lib/reviews";
import { REVIEWS_COPY } from "@/lib/product";

import styles from "./Reviews.module.css";

/**
 * Renders whatever the review source actually holds.
 *
 * With reviews: aggregate rating, star summary and the review cards.
 * Without: an honest zero-state that never implies customers exist.
 *
 * The section is deliberately incapable of showing invented content — it has
 * no sample data path. See lib/reviews.ts.
 */
export async function Reviews() {
  const { summary, reviews } = await loadReviews();
  const hasReviews = reviews.length > 0 && summary.average !== null;

  return (
    <section className="band" id="reviews">
      <div className="shell section">
        <div className={styles.head}>
          <div className={styles.headCopy}>
            <h2 className="h2">{hasReviews ? REVIEWS_COPY.heading : REVIEWS_COPY.zeroHeading}</h2>
          </div>

          {hasReviews && (
            <div className={styles.summary}>
              <Stars value={summary.average} size="lg" />
              <span className={styles.summaryScore}>
                {summary.average?.toFixed(1)} out of 5
              </span>
              <span className={styles.summaryCount}>
                {summary.count} {summary.count === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
        </div>

        {hasReviews ? (
          <div className={styles.rail}>
            {reviews.map((review) => (
              <article key={review.id} className={styles.review}>
                <Stars value={review.rating} size="sm" />
                <h3 className={styles.reviewTitle}>{review.title}</h3>
                <p className={styles.reviewBody}>{review.body}</p>

                <div className={styles.reviewFoot}>
                  <span className={styles.reviewAuthor}>{review.author}</span>
                  {review.verifiedBuyer && (
                    <span className={styles.verified}>✓ Verified buyer</span>
                  )}
                  {review.source !== "store" && review.sourceLabel && (
                    <span className={styles.sourceTag}>{review.sourceLabel}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.zero}>
            <div className={styles.zeroLead}>
              <h3 className={styles.zeroTitle}>{REVIEWS_COPY.zeroTitle}</h3>
              <p className={styles.zeroBody}>{REVIEWS_COPY.zeroBody}</p>
            </div>

            <div className={styles.zeroList}>
              {REVIEWS_COPY.zeroPoints.map((point) => (
                <div key={point.label} className={styles.zeroItem}>
                  <span className="tick" aria-hidden="true">
                    ✓
                  </span>
                  <span>
                    <strong>{point.label}</strong> — {point.body}
                  </span>
                </div>
              ))}
            </div>

            <p className={styles.zeroNote}>{REVIEWS_COPY.zeroNote}</p>
          </div>
        )}
      </div>
    </section>
  );
}
