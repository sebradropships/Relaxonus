"use client";

import { useEffect, useRef } from "react";

import { useProduct } from "@/components/ProductProvider";
import { trackViewContent } from "@/lib/meta-pixel";
import { VARIANTS } from "@/lib/product";

/**
 * Meta Pixel ViewContent, once per product page view, for the option the page
 * opens on at its live Shopify price. Renders nothing.
 *
 * The ref is what makes it once: Strict Mode runs effects twice in
 * development, and the ref survives that remount where a flag in the effect
 * would not.
 */
export function TrackViewContent() {
  const { variant, amountFor, merchandiseIdFor } = useProduct();
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackViewContent({
      merchandiseId: merchandiseIdFor(variant),
      option: VARIANTS[variant].name,
      quantity: 1,
      unitPrice: amountFor(variant),
    });
  }, [variant, amountFor, merchandiseIdFor]);

  return null;
}
