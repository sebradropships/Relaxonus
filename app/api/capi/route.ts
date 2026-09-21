import { after } from "next/server";

import { META_PIXEL_ID } from "@/lib/meta-pixel";
import { STOREFRONT_URL } from "@/lib/site";

/**
 * Conversions API relay for the storefront's pixel events.
 *
 * The browser beacons each event here under the same event id it hands fbq
 * (components/MetaPixel.tsx for PageView, lib/meta-pixel.ts for the rest), and
 * this forwards a server copy to Meta. Meta deduplicates the pair on
 * event_name + event_id, so an event counts once whether one copy lands or
 * both.
 *
 * What the server copy adds: it reaches Meta when a blocker stops
 * facebook.com, or when the visitor leaves before fbevents.js has downloaded;
 * and it carries the visitor's IP and user agent from the request itself,
 * which Meta uses to match the event to the ad click.
 *
 * Inert until META_CAPI_ACCESS_TOKEN is set: beacons are accepted and nothing
 * is forwarded, so this can ship before the token exists.
 *
 * Purchase is deliberately not relayed. Shopify's checkout already sends it
 * server-side through the Facebook & Instagram app, and a public endpoint that
 * accepted it would let anyone forge sales into the event the campaign
 * optimises for.
 */

/* Pinned. v26.0 was the newest version Graph accepted on 2026-09-21; Meta
   keeps each version available for at least two years after release. */
const GRAPH_EVENTS_URL = `https://graph.facebook.com/v26.0/${META_PIXEL_ID}/events`;

const RELAYED = new Set(["PageView", "ViewContent", "AddToCart", "InitiateCheckout"]);

/** A beacon is a few hundred bytes; anything near this is not one of ours. */
const MAX_BODY_BYTES = 4_096;

/** Only pages on the production storefront are relayed, so preview
    deployments and local builds never write to the live dataset. */
const STOREFRONT_HOST = new URL(STOREFRONT_URL).host;

type Fields = Record<string, unknown>;

const isRecord = (value: unknown): value is Fields =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Drops the fields that came out undefined rather than sending them empty. */
const compact = (fields: Fields): Fields =>
  Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));

/** Shopify variant ids, as lib/meta-pixel.ts sends them. */
const isContentId = (value: unknown): value is string =>
  typeof value === "string" && /^\d{1,20}$/.test(value);

const amount = (value: unknown, max: number) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= max
    ? value
    : undefined;

const count = (value: unknown, max: number) =>
  typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= max
    ? value
    : undefined;

const text = (value: unknown) =>
  typeof value === "string" && value.length <= 200 ? value : undefined;

/* Only the fields lib/meta-pixel.ts sends, each inside the range a real
   Relaxonus cart can produce. Anything else is dropped, never forwarded. */
function customData(value: unknown): Fields | undefined {
  if (!isRecord(value)) return undefined;

  /* A value without its currency is an error at Meta, so they travel together. */
  const usd = value.currency === "USD";
  const contentIds = (Array.isArray(value.content_ids) ? value.content_ids : [])
    .filter(isContentId)
    .slice(0, 10);
  const contents = (Array.isArray(value.contents) ? value.contents : [])
    .filter(isRecord)
    .filter((item) => isContentId(item.id))
    .slice(0, 10)
    .map((item) =>
      compact({
        id: item.id,
        quantity: count(item.quantity, 100),
        item_price: amount(item.item_price, 1_000),
      }),
    );

  const data = compact({
    currency: usd ? "USD" : undefined,
    value: usd ? amount(value.value, 5_000) : undefined,
    content_ids: contentIds.length > 0 ? contentIds : undefined,
    content_type: value.content_type === "product" ? "product" : undefined,
    content_name: text(value.content_name),
    content_category: text(value.content_category),
    contents: contents.length > 0 ? contents : undefined,
    num_items: count(value.num_items, 100),
  });
  return Object.keys(data).length > 0 ? data : undefined;
}

function readCookie(header: string | null, name: string): string | undefined {
  for (const part of header?.split(";") ?? []) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name && rest.length > 0) return rest.join("=");
  }
  return undefined;
}

/* The click id rides in on the landing URL before the pixel has stored it,
   and Meta documents building fbc from it server-side. A stored cookie for the
   same click wins, so the browser and server copies carry the same value. */
function clickId(url: URL, stored: string | undefined, now: number): string | undefined {
  const fbclid = url.searchParams.get("fbclid");
  if (!fbclid || !/^[\w-]{1,500}$/.test(fbclid)) return stored;
  if (stored?.endsWith(`.${fbclid}`)) return stored;
  return `fb.1.${now}.${fbclid}`;
}

function sameHost(origin: string, host: string | null): boolean {
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function serverEvent(raw: string, request: Request) {
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(body)) return null;

  const { event_name: name, event_id: id, event_source_url: source } = body;
  if (typeof name !== "string" || !RELAYED.has(name)) return null;
  if (typeof id !== "string" || !/^[\w.-]{8,64}$/.test(id)) return null;

  let url: URL;
  try {
    url = new URL(String(source));
  } catch {
    return null;
  }
  if (url.host !== STOREFRONT_HOST) return null;

  /* Meta requires the user agent on every website event. */
  const userAgent = request.headers.get("user-agent");
  if (!userAgent) return null;

  const now = Date.now();
  const cookies = request.headers.get("cookie");
  const data = name === "PageView" ? undefined : customData(body.custom_data);

  return {
    event_name: name,
    event_time: Math.floor(now / 1000),
    event_id: id,
    event_source_url: url.href,
    action_source: "website",
    user_data: compact({
      /* Vercel puts the visitor first in x-forwarded-for. */
      client_ip_address: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
      client_user_agent: userAgent,
      fbp: readCookie(cookies, "_fbp"),
      fbc: clickId(url, readCookie(cookies, "_fbc"), now),
    }),
    ...(data ? { custom_data: data } : {}),
  };
}

export async function POST(request: Request) {
  const token = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  if (!token) return new Response(null, { status: 204 });

  /* A beacon from our own page carries our origin; anything else is refused. */
  const origin = request.headers.get("origin");
  if (origin && !sameHost(origin, request.headers.get("host"))) {
    return new Response(null, { status: 403 });
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return new Response(null, { status: 413 });
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return new Response(null, { status: 413 });

  const event = serverEvent(raw, request);
  if (!event) return new Response(null, { status: 400 });

  const testEventCode = process.env.META_CAPI_TEST_EVENT_CODE?.trim();

  /* After the response, so the beacon never waits on Meta. */
  after(async () => {
    try {
      const response = await fetch(GRAPH_EVENTS_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          data: [event],
          access_token: token,
          ...(testEventCode ? { test_event_code: testEventCode } : {}),
        }),
        signal: AbortSignal.timeout(5_000),
      });
      /* Meta's reply, never the token: that is in the body we sent, not this one. */
      if (!response.ok) {
        console.error(`[capi] ${event.event_name} rejected (${response.status}): ${await response.text()}`);
      }
    } catch (error) {
      console.error(`[capi] ${event.event_name} not sent:`, error);
    }
  });

  return new Response(null, { status: 202 });
}
