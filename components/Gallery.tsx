"use client";

import Image from "next/image";

import { VARIANTS } from "@/lib/product";
import { useProduct } from "@/components/ProductProvider";

import styles from "./Product.module.css";

export function Gallery() {
  const { variant, image, selectImage } = useProduct();

  const option = VARIANTS[variant];
  const frames = option.frames;
  const current = frames[image] ?? frames[0];

  return (
    <div className={styles.gallery}>
      <div className={styles.frame} style={{ background: option.tint }}>
        <Image
          key={current.url}
          src={current.url}
          alt={current.alt}
          fill
          priority
          sizes="(max-width: 780px) 100vw, 45vw"
          className={styles.frameImage}
        />
      </div>

      <div className={styles.thumbs} role="group" aria-label="Product images">
        {frames.map((frame, index) => {
          const isActive = index === image;

          return (
            <button
              key={`${frame.url}-${index}`}
              type="button"
              className={`${styles.thumb} ${isActive ? styles.thumbActive : ""}`}
              style={{ background: option.tint }}
              onClick={() => selectImage(index)}
              aria-label={`View image ${index + 1}: ${frame.alt}`}
              aria-pressed={isActive}
            >
              <Image
                src={frame.url}
                alt=""
                fill
                sizes="120px"
                className={styles.thumbImage}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
