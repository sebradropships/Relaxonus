import type { MetadataRoute } from "next";

import { STOREFRONT_URL } from "@/lib/site";

/**
 * Points crawlers at the sitemap on the storefront origin, not on the myshopify
 * host — see lib/site.ts for why those two are kept apart.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${STOREFRONT_URL}/sitemap.xml`,
    host: STOREFRONT_URL,
  };
}
