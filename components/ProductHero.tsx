"use client";

import { AddToCartButton } from "@/components/AddToCartButton";
import { Gallery } from "@/components/Gallery";
import { VariantPicker } from "@/components/VariantPicker";
import { useProduct } from "@/components/ProductProvider";
import {
  BENEFITS,
  EYEBROW,
  PRODUCT_NAME,
  PRODUCT_TAGLINE,
  TRUST_POINTS,
} from "@/lib/product";

import styles from "./Product.module.css";

export function ProductHero() {
  const { heroRef } = useProduct();

  return (
    <section id="top" ref={heroRef} className={`shell ${styles.hero}`}>
      <Gallery />

      <div className={styles.buybox}>
        <span className="eyebrow">{EYEBROW}</span>

        <div className={styles.titleBlock}>
          <h1 className="h1">{PRODUCT_NAME}</h1>
          <p className="lede">{PRODUCT_TAGLINE}</p>
        </div>

        <ul className={styles.benefits}>
          {BENEFITS.map((benefit) => (
            <li key={benefit}>
              <span className="tick" aria-hidden="true">
                ✓
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        <VariantPicker />

        <div className={styles.ctaBlock}>
          <AddToCartButton className="btn btn-primary btn-block" />
          <div className={styles.trust}>
            {TRUST_POINTS.map((point) => (
              <span key={point}>✓ {point}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
