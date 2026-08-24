"use client";

import Image from "next/image";
import { useRef, type KeyboardEvent } from "react";

import { SET_BADGE, VARIANTS, VARIANT_ORDER } from "@/lib/product";
import { useProduct } from "@/components/ProductProvider";

import styles from "./Product.module.css";

const ARROW_KEYS = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];

export function VariantPicker() {
  const { variant, selectVariant, priceFor, availableFor } = useProduct();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  /* Radiogroups are expected to move selection with the arrow keys. */
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!ARROW_KEYS.includes(event.key)) return;

    const current = VARIANT_ORDER.indexOf(variant);
    if (current === -1) return;

    event.preventDefault();

    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const next = (current + (forward ? 1 : -1) + VARIANT_ORDER.length) % VARIANT_ORDER.length;

    selectVariant(VARIANT_ORDER[next]);
    buttons.current[next]?.focus();
  }

  return (
    <div className={styles.variants}>
      <span className="field-label" id="variant-label">
        CHOOSE YOUR OPTION
      </span>

      <div
        className={styles.variantList}
        role="radiogroup"
        aria-labelledby="variant-label"
        onKeyDown={handleKeyDown}
      >
        {VARIANT_ORDER.map((key, index) => {
          const option = VARIANTS[key];
          const isActive = key === variant;
          const isSet = key === "set";

          return (
            <button
              key={key}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => selectVariant(key)}
              className={[
                styles.variant,
                isActive ? styles.variantActive : "",
                isSet ? styles.variantFeatured : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className={styles.swatch} style={{ background: option.tint }}>
                <Image
                  src={option.frames[0].url}
                  alt=""
                  fill
                  sizes="56px"
                  className={styles.swatchImage}
                />
              </span>

              <span className={styles.variantText}>
                {isSet ? (
                  <span className={styles.variantNameRow}>
                    <span className={styles.variantName}>{option.name}</span>
                    <span className="pill">{SET_BADGE}</span>
                  </span>
                ) : (
                  <span className={styles.variantName}>{option.name}</span>
                )}
                <span className={styles.variantMeta}>
                  {availableFor(key) ? option.meta : "Sold out"}
                </span>
              </span>

              <span className={`${styles.variantPrice} price`}>{priceFor(key)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
