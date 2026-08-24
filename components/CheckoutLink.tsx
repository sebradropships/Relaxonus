"use client";

import { useProduct } from "@/components/ProductProvider";

import styles from "./Product.module.css";

/**
 * Hands off to Shopify's hosted checkout.
 *
 * Only rendered once there is a cart — an empty checkout is a dead end, and
 * Shopify's own cart page would reject it anyway.
 */
export function CheckoutLink() {
  const { checkoutUrl, cart } = useProduct();

  if (!checkoutUrl || cart === 0) return null;

  return (
    <a className={`btn btn-outline ${styles.checkout}`} href={checkoutUrl}>
      CHECK OUT · {cart} {cart === 1 ? "ITEM" : "ITEMS"}
    </a>
  );
}

/** Inline message shown when Shopify refuses an add. */
export function CartError() {
  const { error } = useProduct();
  if (!error) return null;

  return (
    <p id="cart-error" className={styles.cartError} role="alert">
      {error}
    </p>
  );
}
