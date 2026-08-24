"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { AddToCartButton } from "@/components/AddToCartButton";
import { CartError } from "@/components/CheckoutLink";
import { useProduct } from "@/components/ProductProvider";
import { PRODUCT_NAME, STICKY_OFFSET, VARIANTS } from "@/lib/product";

import styles from "./Product.module.css";

/**
 * Follows the buy box: once the hero has scrolled off the top of the viewport,
 * the current option and its call to action stay reachable at the bottom.
 */
export function StickyBar() {
  const { heroRef, variant, priceFor } = useProduct();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    /* Pulling the root's top edge down by STICKY_OFFSET means the hero stops
       intersecting exactly when its bottom passes that line — the same moment
       the design calls for, without a scroll listener. */
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: `-${STICKY_OFFSET}px 0px 0px 0px`, threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroRef]);

  if (!visible) return null;

  const option = VARIANTS[variant];

  return (
    <div className={styles.stickyBar}>
      <div className={`shell ${styles.stickyInner}`}>
        <span className={styles.stickyThumb} style={{ background: option.tint }}>
          <Image
            src={option.frames[0].url}
            alt=""
            fill
            sizes="40px"
            className={styles.stickyImage}
          />
        </span>

        <span className={styles.stickyText}>
          <span className={styles.stickyTitle}>
            {option.name} • {PRODUCT_NAME}
          </span>
          <span className={`${styles.stickyPrice} price`}>{priceFor(variant)}</span>
        </span>

        <AddToCartButton className={`btn btn-primary ${styles.stickyCta}`} />
      </div>

      {/* Visual only: the hero's alert already announced this. Without it a
          failed add from down the page looks like a silent no-op, because the
          hero's error message is by definition scrolled off screen. */}
      <div className={`shell ${styles.stickyError}`}>
        <CartError decorative />
      </div>
    </div>
  );
}
