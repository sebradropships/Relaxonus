import { FINAL_CTA } from "@/lib/product";

import styles from "./Marketing.module.css";

export function FinalCta() {
  return (
    <section className={styles.finalCta}>
      <div className={`shell shell-narrow ${styles.finalCtaInner}`}>
        <h2 className="h2 h2-xl">{FINAL_CTA.heading}</h2>
        <p className="lede lede-invert">{FINAL_CTA.body}</p>

        <a className="btn btn-invert" href="#top">
          {FINAL_CTA.cta}
        </a>
      </div>
    </section>
  );
}
