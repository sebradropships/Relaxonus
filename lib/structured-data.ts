import {
  PRODUCT_NAME,
  SEO,
  TIER_ORDER,
  VARIANTS,
  type VariantKey,
} from "@/lib/product";
import { STOREFRONT_URL } from "@/lib/site";
import type { ProductCommerce } from "@/lib/shopify/types";

/**
 * Product JSON-LD, built from whatever Shopify actually returned.
 *
 * The prices here must not be able to disagree with the prices on the page, so they
 * come from the same live `ProductCommerce` the hero renders from, and fall back to
 * the committed ones exactly where the rest of the app does.
 *
 * Deliberately omits `aggregateRating` and `review`: there are no genuine reviews yet
 * (see REVIEWS_EMPTY), and invented ones are a manual-action risk, not a style choice.
 *
 * Deliberately omits `shippingDetails`: shipping is calculated at checkout, so any rate
 * stated here would be a number nobody can honour.
 */

/** "$34.99" -> "34.99". The committed prices carry a symbol; Shopify's do not. */
function bare(price: string): string {
  return price.replace(/[^0-9.]/g, "");
}

function absolute(url: string): string {
  return url.startsWith("http") ? url : `${STOREFRONT_URL}${url}`;
}

function priceOf(key: VariantKey, commerce: ProductCommerce): string {
  const live = commerce.variants?.[key]?.price.amount;
  return live ?? bare(VARIANTS[key].price);
}

export function productJsonLd(commerce: ProductCommerce) {
  const offers = TIER_ORDER.map((key) => {
    const variant = VARIANTS[key];
    const live = commerce.variants?.[key];
    const available = live?.availableForSale ?? true;

    return {
      "@type": "Offer",
      name: variant.name,
      sku: variant.variantId.slice(variant.variantId.lastIndexOf("/") + 1),
      price: priceOf(key, commerce),
      priceCurrency: live?.price.currencyCode ?? "USD",
      availability: available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      url: STOREFRONT_URL,
      seller: { "@type": "Organization", name: "Relaxonus" },
    };
  });

  const prices = offers.map((offer) => Number.parseFloat(offer.price));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: PRODUCT_NAME,
    description: SEO.description,
    brand: { "@type": "Brand", name: "Relaxonus" },
    category: "Health & Beauty > Personal Care > Massage & Relaxation",
    image: [...new Set(TIER_ORDER.map((key) => absolute(VARIANTS[key].frames[0].url)))],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: Math.min(...prices).toFixed(2),
      highPrice: Math.max(...prices).toFixed(2),
      offerCount: offers.length,
      offers,
    },
  };
}
