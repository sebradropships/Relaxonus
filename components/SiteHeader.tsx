"use client";

import { NAV_LINKS } from "@/lib/product";
import { useProduct } from "@/components/ProductProvider";

import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const { cart, addToCart } = useProduct();

  return (
    <header className={styles.header}>
      <div className={`shell ${styles.inner}`}>
        <a className="brand" href="#top">
          RELAXONUS
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.label} className={styles.link} href={link.href}>
              {link.label}
            </a>
          ))}

          <button
            type="button"
            className={styles.cartButton}
            onClick={addToCart}
            aria-label="Add to cart"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 8h14l-1.2 11H6.2L5 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>

            {cart > 0 && <span className={styles.badge}>{cart}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
}
