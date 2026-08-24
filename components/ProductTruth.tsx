import { TRUTH_CARDS, TRUTH_HEADING, TRUTH_SUB } from "@/lib/product";

import styles from "./Marketing.module.css";

/**
 * Stands where a reviews carousel would normally go. The store has no orders
 * yet, so there is no honest social proof to show — this section builds
 * confidence from verifiable product facts instead. When real reviews exist,
 * this is the slot they belong in.
 */
export function ProductTruth() {
  return (
    <section className="band">
      <div className="shell section">
        <div className={styles.truthHead}>
          <h2 className="h2">{TRUTH_HEADING}</h2>
          <p className={styles.truthSub}>{TRUTH_SUB}</p>
        </div>

        <div className={styles.truthGrid}>
          {TRUTH_CARDS.map((card) => (
            <div key={card.title} className={styles.truthCard}>
              <h3 className={styles.truthTitle}>{card.title}</h3>
              <p className={styles.truthBody}>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
