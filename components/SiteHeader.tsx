"use client";

import { NAV_LINKS } from "@/lib/product";
import { useProduct } from "@/components/ProductProvider";

import styles from "./SiteHeader.module.css";

function CartIcon() {
  return (
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
  );
}

export function SiteHeader() {
  const { cart, checkoutUrl } = useProduct();

  const hasCart = cart > 0 && Boolean(checkoutUrl);

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

          {/* With a cart, this goes to checkout. Without one, it returns to the
              buy box — it never silently adds a product, which is what a cart
              icon doing double duty as an add button would do. */}
          {hasCart ? (
            <a
              className={styles.cartButton}
              href={checkoutUrl as string}
              aria-label={`Check out, ${cart} ${cart === 1 ? "item" : "items"} in cart`}
            >
              <CartIcon />
              <span className={styles.badge}>{cart}</span>
            </a>
          ) : (
            <a className={styles.cartButton} href="#top" aria-label="Your cart is empty. Go to the product options.">
              <CartIcon />
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
