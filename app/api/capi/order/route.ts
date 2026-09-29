import { createHash, createHmac, timingSafeEqual } from "node:crypto";

import { after } from "next/server";

import { META_PIXEL_ID } from "@/lib/meta-pixel";
import { STOREFRONT_URL } from "@/lib/site";

/**
 * Purchase, sent to the Conversions API from Shopify's order webhook.
 *
 * Purchase cannot come from the browser here. Checkout is Shopify's own
 * domain: the shopper leaves relaxonus.com at InitiateCheckout and the order
 * completes on a page this app never renders, so there is no moment on our
 * origin at which to fire it. A public endpoint that accepted a browser-sent
 * Purchase would also be a forgery vector straight into the event the
 * campaigns optimise for — anyone could post sales that never happened, and
 * the optimiser would bid on them.
 *
 * So Purchase arrives the one way it can be trusted: Shopify POSTs the order
 * here and the request is authenticated by HMAC against the webhook signing
 * secret before a single field of the body is read.
 *
 * Register it in Shopify admin -> Settings -> Notifications -> Webhooks:
 *
 *   Event     Order payment (orders/paid)
 *   Format    JSON
 *   URL       https://www.relaxonus.com/api/capi/order
 *
 * and put the signing secret Shopify shows there in SHOPIFY_WEBHOOK_SECRET.
 *
 * Inert until both SHOPIFY_WEBHOOK_SECRET and META_CAPI_ACCESS_TOKEN are set:
 * the webhook is acknowledged and nothing is forwarded, so this can ship
 * before either exists without Shopify retrying and then disabling the
 * subscription.
 */

/* Same pinned version as the browser relay in ../route.ts. */
const GRAPH_EVENTS_URL = `https://graph.facebook.com/v26.0/${META_PIXEL_ID}/events`;

/** Meta rejects website events older than this, so a retry storm or a replayed
    body from weeks ago is dropped here rather than sent and refused there. */
const MAX_EVENT_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** An order payload is a few KB. A megabyte of it is not one of Shopify's. */
const MAX_BODY_BYTES = 1_000_000;

const TOPICS = new Set(["orders/paid", "orders/create"]);

type Fields = Record<string, unknown>;

const isRecord = (value: unknown): value is Fields =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const compact = (fields: Fields): Fields =>
  Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));

const record = (value: unknown): Fields => (isRecord(value) ? value : {});

/* --------------------------- request authenticity -------------------------- */

/**
 * Shopify signs the raw body with the webhook secret and sends the digest
 * base64 in X-Shopify-Hmac-Sha256.
 *
 * timingSafeEqual needs equal lengths, so the length is compared first. On its
 * own that reveals only whether the header was the right shape, which the
 * header already shows.
 */
function signed(raw: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const expected = createHmac("sha256", secret).update(raw, "utf8").digest();
  let received: Buffer;
  try {
    received = Buffer.from(header, "base64");
  } catch {
    return false;
  }
  return received.length === expected.length && timingSafeEqual(received, expected);
}

/* ----------------------------- advanced matching -------------------------- */

/**
 * Meta accepts these identifiers only as SHA-256 of a normalised value, and
 * the hashing happens here, before anything leaves the process. Raw customer
 * detail is never forwarded and never logged.
 *
 * The normalisation follows Meta's spec — trimmed, lowercased, punctuation
 * dropped where they say to drop it — because a differently-normalised value
 * hashes to something Meta cannot match. That is the worst outcome available:
 * the data is sent and none of it matches.
 */
const sha256 = (value: string) => createHash("sha256").update(value, "utf8").digest("hex");

const hashed = (value: unknown, normalise: (input: string) => string) => {
  if (typeof value !== "string") return undefined;
  const normalised = normalise(value);
  return normalised.length > 0 ? sha256(normalised) : undefined;
};

const plain = (input: string) => input.trim().toLowerCase();
/** Digits only, country code included, as Meta documents for phone numbers. */
const digits = (input: string) => input.replace(/\D/g, "");
/** Letters only, so "O'Brien" and "OBrien" hash alike. */
const letters = (input: string) => plain(input).replace(/[^a-zÀ-ɏ]/g, "");
/** US ZIPs match on the first five digits. ZIP+4 would not. */
const postcode = (input: string) => plain(input).split("-")[0].slice(0, 5);

/** Shopify puts cart attributes in note_attributes as {name, value} pairs. */
function attribute(order: Fields, name: string): string | undefined {
  const notes = Array.isArray(order.note_attributes) ? order.note_attributes : [];
  for (const note of notes) {
    if (isRecord(note) && note.name === name && typeof note.value === "string") {
      return note.value;
    }
  }
  return undefined;
}

function userData(order: Fields): Fields {
  const address = isRecord(order.shipping_address)
    ? order.shipping_address
    : record(order.billing_address);
  const customer = record(order.customer);
  const client = record(order.client_details);

  return compact({
    em: hashed(order.email ?? customer.email, plain),
    ph: hashed(order.phone ?? customer.phone ?? address.phone, digits),
    fn: hashed(address.first_name ?? customer.first_name, letters),
    ln: hashed(address.last_name ?? customer.last_name, letters),
    ct: hashed(address.city, letters),
    st: hashed(address.province_code, plain),
    zp: hashed(address.zip, postcode),
    country: hashed(address.country_code, plain),
    /* The shopper's own IP and user agent, as Shopify recorded them at
       checkout — not this server's. Meta uses both to tie the order back to
       the ad click, and a webhook has no other way to supply them. */
    client_ip_address: typeof order.browser_ip === "string" ? order.browser_ip : undefined,
    client_user_agent: typeof client.user_agent === "string" ? client.user_agent : undefined,
    /* The pixel cookies, if the cart carried them through checkout. Meta
       matches on these far more strongly than on hashed detail, so they are
       worth reading even though a headless cart usually has neither. */
    fbp: attribute(order, "_fbp"),
    fbc: attribute(order, "_fbc"),
  });
}

/* --------------------------------- the event ------------------------------ */

const money = (value: unknown) => {
  const amount = typeof value === "string" ? Number.parseFloat(value) : value;
  return typeof amount === "number" && Number.isFinite(amount) && amount >= 0
    ? Math.round(amount * 100) / 100
    : undefined;
};

/**
 * Product revenue, not the amount charged: the subtotal after discounts and
 * before shipping and tax. Reported ROAS then measures what the product
 * actually brought in, which is the figure the campaign is judged on.
 * current_subtotal_price is already net of any refund.
 */
const orderValue = (order: Fields) =>
  money(order.current_subtotal_price) ?? money(order.subtotal_price) ?? money(order.total_price);

function purchaseEvent(order: Fields) {
  const id = order.id;
  if (typeof id !== "number" && typeof id !== "string") return null;

  /* Shopify's own test orders must not reach the live dataset. */
  if (order.test === true) return null;

  const created = Date.parse(String(order.created_at ?? ""));
  const createdAt = Number.isFinite(created) ? created : Date.now();
  if (Date.now() - createdAt > MAX_EVENT_AGE_MS) return null;

  const currency = typeof order.currency === "string" ? order.currency.toUpperCase() : undefined;
  const value = orderValue(order);
  if (!currency || value === undefined) return null;

  const lines = (Array.isArray(order.line_items) ? order.line_items : [])
    .filter(isRecord)
    .slice(0, 50)
    .map((line) => ({
      id: line.variant_id != null ? String(line.variant_id) : undefined,
      quantity: typeof line.quantity === "number" ? line.quantity : 1,
      item_price: money(line.price),
    }))
    .filter((line): line is { id: string; quantity: number; item_price: number | undefined } =>
      line.id !== undefined,
    )
    .map((line) => compact(line));

  const contentIds = lines.map((line) => line.id as string);

  return {
    event_name: "Purchase",
    event_time: Math.floor(createdAt / 1000),
    /* The order id, so Shopify's webhook retries collapse into one event
       instead of counting the sale twice. It travels as custom_data.order_id
       as well, which is what lets Meta reconcile this against any Purchase the
       Shopify Facebook & Instagram app sends for the same order. */
    event_id: `shopify-order-${id}`,
    /* Our own storefront, not Shopify's order-status URL: the campaign's other
       events all name this origin, and the checkout host is not a page we
       serve. */
    event_source_url: STOREFRONT_URL,
    action_source: "website",
    user_data: userData(order),
    custom_data: compact({
      currency,
      value,
      order_id: String(id),
      content_type: "product",
      content_ids: contentIds.length > 0 ? contentIds : undefined,
      contents: lines.length > 0 ? lines : undefined,
      num_items: lines.reduce((sum, line) => sum + Number(line.quantity ?? 0), 0) || undefined,
    }),
  };
}

/* ---------------------------------- handler ------------------------------- */

export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET?.trim();
  const token = process.env.META_CAPI_ACCESS_TOKEN?.trim();

  /* 200, not 500: an unconfigured relay must not make Shopify retry for hours
     and then disable the subscription. */
  if (!secret || !token) return new Response(null, { status: 200 });

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return new Response(null, { status: 413 });
  }

  const topic = request.headers.get("x-shopify-topic");
  if (topic && !TOPICS.has(topic)) return new Response(null, { status: 200 });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return new Response(null, { status: 413 });

  /* Authenticity first. Nothing below this line trusts the body. */
  if (!signed(raw, request.headers.get("x-shopify-hmac-sha256"), secret)) {
    return new Response(null, { status: 401 });
  }

  const shop = request.headers.get("x-shopify-shop-domain");
  const expectedShop = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  if (expectedShop && shop && shop !== expectedShop) {
    return new Response(null, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!isRecord(body)) return new Response(null, { status: 400 });

  const event = purchaseEvent(body);
  /* Acknowledged either way: a payload we choose not to forward — a test
     order, a stale retry — is not a delivery failure. */
  if (!event) return new Response(null, { status: 200 });

  const testEventCode = process.env.META_CAPI_TEST_EVENT_CODE?.trim();

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
      if (!response.ok) {
        /* Meta's reply and our own order id. Nothing customer-identifying is
           logged, hashed or otherwise. */
        console.error(
          `[capi] Purchase ${event.event_id} rejected (${response.status}): ${await response.text()}`,
        );
      }
    } catch (error) {
      console.error(`[capi] Purchase ${event.event_id} not sent:`, error);
    }
  });

  return new Response(null, { status: 200 });
}
