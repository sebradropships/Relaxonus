import { WHY_HEADING, WHY_ROWS } from "@/lib/product";

import styles from "./Marketing.module.css";

export function Why() {
  return (
    <section className="shell shell-narrow section">
      <h2 className="h2 h2-stacked">{WHY_HEADING}</h2>

      <div className={styles.why}>
        <div className={styles.whyHead}>
          <span />
          <span>RELAXONUS</span>
          <span>POWERED MASSAGER</span>
        </div>

        {WHY_ROWS.map((row) => (
          <div key={row.label} className={styles.whyRow}>
            <span className={styles.whyLabel}>{row.label}</span>
            <span className={styles.whyOurs}>{row.ours}</span>
            <span className={styles.whyTheirs}>{row.theirs}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
