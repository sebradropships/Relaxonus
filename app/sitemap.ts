import type { MetadataRoute } from "next";

import { STOREFRONT_URL } from "@/lib/site";

/**
 * One entry, because this is genuinely a one-page storefront: the hero, the value
 * section and the buy box all live at `/`. Listing routes that do not exist is
 * worse than a short sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: STOREFRONT_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
