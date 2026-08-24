import Image from "next/image";

import { LIFESTYLE } from "@/lib/product";

import styles from "./Marketing.module.css";

export function Lifestyle() {
  return (
    <section className="shell section">
      <div className={styles.lifestyle}>
        <Image
          src={LIFESTYLE.image.url}
          alt={LIFESTYLE.image.alt}
          fill
          sizes="(max-width: 780px) 100vw, 1140px"
          className={styles.lifestyleImage}
        />

        <div className={styles.lifestyleCopy}>
          <h2 className="h2 h2-xl">{LIFESTYLE.heading}</h2>
          <p className="lede">{LIFESTYLE.body}</p>
          <a className="btn btn-primary btn-inline" href="#how">
            {LIFESTYLE.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
