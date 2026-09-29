/**
 * Meta's catalog syncs from Shopify, so Instagram Shop and the product feed hand
 * shoppers Shopify's own URL shape -- /products/<handle>, /collections/<handle>.
 * This storefront is one page at the root with no such routes, so every one of
 * those URLs was a 404: the click lands, the shopper leaves, and the ad account
 * still reports a healthy link click. Hoygi had the same hole.
 *
 * 307 rather than 308: nothing at those paths is indexed or in the sitemap, and a
 * permanent redirect is cached by the browser for as long as it pleases, which
 * would fight us the day a real /products/<handle> route exists.
 *
 * Query strings survive the hop, which is the part that matters for attribution --
 * Next merges the incoming request's query into a destination that declares none
 * of its own, so ?fbclid=, ?utm_* and ?variant= all reach / intact. fbc is built
 * from the fbclid on the landing URL in app/api/capi/route.ts, so a stripped query
 * would silently break click attribution.
 */
const CATALOG_PATHS = ["/products", "/collections"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root so Turbopack ignores unrelated lockfiles in parent
  // directories (e.g. C:\Users\ADMIN\pnpm-lock.yaml).
  turbopack: {
    root: import.meta.dirname,
  },
  async redirects() {
    /* :path* is zero-or-more, so one rule per prefix covers the bare
       /collections as well as /collections/anything/deeper. */
    return CATALOG_PATHS.map((base) => ({
      source: `${base}/:path*`,
      destination: "/",
      permanent: false,
    }));
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
};

export default nextConfig;
