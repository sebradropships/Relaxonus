import Image from "next/image";

import { ChooseVariantButton } from "@/components/ChooseVariantButton";
import { OFFERS, SHOP_HEADING, VARIANTS } from "@/lib/product";

import styles from "./Marketing.module.css";

const MEDIA_TINT = {
  blue: styles.tintBlue,
  pink: styles.tintPink,
  set: styles.tintSet,
} as const;

const EYEBROW_TONE = {
  blue: styles.eyebrowBlue,
  pink: styles.eyebrowPink,
  set: "",
} as const;

export function Shop() {
  return (
    <section className="band" id="shop">
      <div className="shell section">
        <h2 className="h2 h2-stacked">{SHOP_HEADING}</h2>

        <div className={styles.offerGrid}>
          {OFFERS.map((offer) => {
            const option = VARIANTS[offer.variant];
            const hero = option.frames[0];

            return (
              <div
                key={offer.variant}
                className={`${styles.offer} ${offer.featured ? styles.offerFeatured : ""}`}
              >
                {offer.featured && (
                  <span className={`pill ${styles.offerBadge}`}>BEST VALUE</span>
                )}

                <div className={`${styles.offerMedia} ${MEDIA_TINT[offer.variant]}`}>
                  <Image
                    src={hero.url}
                    alt={hero.alt}
                    fill
                    sizes="(max-width: 780px) 100vw, 360px"
                    className={styles.offerImage}
                  />
                </div>

                <span className={`${styles.offerEyebrow} ${EYEBROW_TONE[offer.variant]}`}>
                  {offer.eyebrow}
                </span>
                <h3 className={styles.offerTitle}>{offer.title}</h3>
                <p className={styles.offerBody}>{offer.body}</p>
                <span className={`${styles.offerPrice} price`}>{option.price}</span>

                <ChooseVariantButton
                  variant={offer.variant}
                  label={offer.cta}
                  className={offer.featured ? "btn btn-primary" : "btn btn-outline"}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
