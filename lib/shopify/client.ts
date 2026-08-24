import "server-only";

/**
 * The only place this app talks to Shopify.
 *
 * Uses the Storefront API public access token. That token is designed to be
 * publicly readable — it is scoped to unauthenticated storefront reads — but
 * it is still kept server-side here so it never enters the client bundle and
 * so cart mutations cannot be driven straight from a browser console.
 *
 * An Admin API token (`shpat_…`) must never appear in this file or any other.
 */

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2026-07";
const TOKEN = process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN;

export class ShopifyError extends Error {
  constructor(
    message: string,
    readonly detail?: unknown,
  ) {
    super(message);
    this.name = "ShopifyError";
  }
}

/** True when the environment is configured enough to reach Shopify at all. */
export function isConfigured(): boolean {
  return Boolean(DOMAIN && TOKEN);
}

interface RequestOptions {
  variables?: Record<string, unknown>;
  /** Seconds to cache. Omit for uncacheable requests (anything cart-related). */
  revalidate?: number;
  tags?: string[];
}

async function request<T>(query: string, options: RequestOptions = {}): Promise<T> {
  if (!DOMAIN || !TOKEN) {
    throw new ShopifyError(
      "Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_PUBLIC_TOKEN.",
    );
  }

  const response = await fetch(`https://${DOMAIN}/api/${VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables: options.variables ?? {} }),
    // GraphQL goes over POST, which Next never caches implicitly. Caching is
    // therefore always explicit: a revalidate window, or nothing at all.
    ...(options.revalidate === undefined
      ? { cache: "no-store" as const }
      : { next: { revalidate: options.revalidate, tags: options.tags } }),
  });

  if (!response.ok) {
    throw new ShopifyError(`Storefront API returned ${response.status}`, await response.text());
  }

  const body = (await response.json()) as { data?: T; errors?: unknown };

  if (body.errors) {
    throw new ShopifyError("Storefront API returned GraphQL errors", body.errors);
  }
  if (!body.data) {
    throw new ShopifyError("Storefront API returned no data");
  }

  return body.data;
}

/** Cacheable read. Use for catalogue data only — never for a cart. */
export function storefrontCached<T>(
  query: string,
  variables: Record<string, unknown>,
  revalidate: number,
  tags?: string[],
): Promise<T> {
  return request<T>(query, { variables, revalidate, tags });
}

/** Uncached. Every cart read and mutation goes through here. */
export function storefrontLive<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  return request<T>(query, { variables });
}
