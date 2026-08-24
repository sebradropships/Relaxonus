import Image from "next/image";

import { STEPS } from "@/lib/product";

import styles from "./Marketing.module.css";

const TINTS = {
  blue: styles.tintBlue,
  pink: styles.tintPink,
  sand: styles.tintSand,
} as const;

export function Steps() {
  return (
    <section id="how" className="shell section-tight-top">
      <div className={styles.stepGrid}>
        {STEPS.map((step) => (
          <div key={step.num} className={styles.step}>
            <div className={`${styles.stepMedia} ${TINTS[step.tint]}`}>
              <Image
                src={step.image.url}
                alt={step.image.alt}
                fill
                sizes="(max-width: 780px) 100vw, 370px"
                className={styles.stepImage}
              />
            </div>
            <span className={styles.stepNum}>{step.num}</span>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepBody}>{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
