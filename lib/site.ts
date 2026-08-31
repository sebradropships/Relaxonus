/**
 * The canonical, customer-facing storefront URL.
 *
 * Two Shopify-related hostnames exist in this project and they are NOT
 * interchangeable. Keeping them apart is the whole point of this file:
 *
 *   SHOPIFY_STORE_DOMAIN — `…myshopify.com`. API ACCESS ONLY. It is the host
 *     of the Storefront GraphQL endpoint in lib/shopify/client.ts and must
 *     never appear in a link a shopper can follow, nor in a canonical tag.
 *
 *   SITE_URL (resolved here) — the headless storefront shoppers actually
 *     browse. Customer-facing navigation and canonical SEO only. Never sent
 *     to Shopify as an API host.
 *
 * Resolution order:
 *   1. SITE_URL, for pinning a production domain explicitly.
 *   2. Vercel's own production domain, which already resolves to the custom
 *      domain once one is attached to the project — so a preview build still
 *      declares the production canonical rather than its own throwaway URL.
 *   3. localhost, so a local build never claims a production canonical.
 *
 * Note what this does NOT do: it has no bearing on where Shopify's hosted
 * checkout sends a shopper who clicks its logo. That destination is the shop's
 * PRIMARY DOMAIN under Shopify admin → Settings → Domains, is rendered by
 * Shopify itself, and is not settable from the Storefront API or from any
 * code in this repository.
 */

function resolveStorefrontUrl(): string {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const STOREFRONT_URL = resolveStorefrontUrl();
