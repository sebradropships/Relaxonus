import { PRODUCT_NAME } from "@/lib/product";
import type { CartLine, Money } from "@/lib/shopify/types";
import type { MetaPixelEventParams, MetaPixelStandardEvent } from "@/types/meta-pixel";

/**
 * Standard commerce events for the Meta Pixel installed by
 * components/MetaPixel.tsx: ViewContent, AddToCart and InitiateCheckout.
 *
 * Every figure is live Shopify money handed in by the caller — the variant's
 * current price, or the cart Shopify just returned — never a number written
 * down here. content_ids are the numeric Shopify variant ids the cart adds by,
 * identical across all three events so Meta can tie a view to the add and the
 * checkout that followed it.
 *
 * Each event goes out twice under one event id: through fbq from the browser,
 * and through the same-origin Conversions API relay, which reaches Meta even
 * when a blocker stops the pixel. Meta counts the pair once.
 *
 * Browser only, and never throws: on the server these do nothing. Tracking
 * must not be able to break the purchase path.
 */

/** Relaxonus 1 Pixel — also the dataset app/api/capi/route.ts posts to. */
export const META_PIXEL_ID = "1082533454743448";

/** Dispatched by the base code once `fbq` exists; releases anything queued before it. */
export const PIXEL_READY_EVENT = "relaxonus:pixel-ready";

/** Same-origin relay to the Conversions API (app/api/capi/route.ts). */
export const CAPI_PATH = "/api/capi";

const CURRENCY = "USD";
const CONTENT_CATEGORY = "Manual neck & shoulder massager";

export interface PixelItem {
  /** Shopify variant GID, exactly as the cart adds it. */
  merchandiseId: string;
  /** Customer-facing option name — "Blue", "The Duo — Blue + Pink". */
  option: string;
  quantity: number;
  /** Live unit price, in USD. */
  unitPrice: number;
}

const round = (value: number) => Math.round(value * 100) / 100;

/** "gid://shopify/ProductVariant/53761385136491" → "53761385136491". */
const contentId = (gid: string) => gid.slice(gid.lastIndexOf("/") + 1);

let queued: (() => void)[] = [];

/** One id per event, shared by the browser pixel and its server copy so Meta
    counts the pair once. */
function newEventId(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/* The server copy. First-party, so a blocker that stops facebook.com leaves it
   alone, and a beacon, so it survives the page unloading — InitiateCheckout
   fires on the way out to Shopify. The relay decides what reaches Meta. */
function relay(event: MetaPixelStandardEvent, eventId: string, params: MetaPixelEventParams) {
  try {
    const body = JSON.stringify({
      event_name: event,
      event_id: eventId,
      event_source_url: window.location.href,
      custom_data: params,
    });
    if (navigator.sendBeacon?.(CAPI_PATH, body)) return;
    void fetch(CAPI_PATH, { method: "POST", body, keepalive: true }).catch(() => {});
  } catch {
    /* Tracking must not be able to break the purchase path. */
  }
}

function send(event: MetaPixelStandardEvent, params: MetaPixelEventParams) {
  if (typeof window === "undefined") return;

  const eventID = newEventId();
  relay(event, eventID, params);

  const fire = () => window.fbq("track", event, params, { eventID });
  if (typeof window.fbq === "function") {
    fire();
    return;
  }

  /* The base code is inline in the server HTML, so fbq normally exists before
     any of this runs. It is missing only if that script never ran — inline
     scripts blocked outright. Hold the event until the base code announces
     itself; if it never does, the queue never drains and the server copy
     above is the only record. */
  queued.push(fire);
  if (queued.length > 1) return;
  window.addEventListener(
    PIXEL_READY_EVENT,
    () => {
      const pending = queued;
      queued = [];
      pending.forEach((run) => run());
    },
    { once: true },
  );
}

function itemParams(item: PixelItem): MetaPixelEventParams {
  const id = contentId(item.merchandiseId);
  return {
    content_ids: [id],
    content_name: `${PRODUCT_NAME} (${item.option})`,
    content_category: CONTENT_CATEGORY,
    content_type: "product",
    contents: [{ id, quantity: item.quantity, item_price: round(item.unitPrice) }],
    value: round(item.unitPrice * item.quantity),
    currency: CURRENCY,
  };
}

/** The product page, for the option it opens on. */
export function trackViewContent(item: PixelItem) {
  send("ViewContent", itemParams(item));
}

/** Units Shopify has confirmed into the cart. Call on its response, never on the click. */
export function trackAddToCart(item: PixelItem) {
  send("AddToCart", itemParams(item));
}

/** The cart exactly as Shopify returned it, as the shopper leaves for checkout. */
export function trackInitiateCheckout(lines: CartLine[], subtotal: Money) {
  const contents = lines.map((line) => ({
    id: contentId(line.merchandiseId),
    quantity: line.quantity,
    item_price: round(Number.parseFloat(line.unitPrice.amount)),
  }));

  send("InitiateCheckout", {
    content_ids: contents.map((item) => item.id),
    content_name: PRODUCT_NAME,
    content_category: CONTENT_CATEGORY,
    content_type: "product",
    contents,
    num_items: contents.reduce((sum, item) => sum + item.quantity, 0),
    value: round(Number.parseFloat(subtotal.amount)),
    currency: CURRENCY,
  });
}
