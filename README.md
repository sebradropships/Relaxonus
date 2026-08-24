# Relaxonus

Product page for the Relaxonus Neck Massager — Next.js (App Router) + TypeScript.
Implemented from the Claude Design source
[`Relaxonus Product Page.dc.html`](https://claude.ai/design/p/32038b4e-d800-4166-9260-8818f23a128c),
with product data and photography from the Shopify store `dk0tc0-cr.myshopify.com`.

## Getting started

```bash
npm install
```

```bash
npm run dev
```

Runs at http://localhost:3000.

| Script              | Does                       |
| ------------------- | -------------------------- |
| `npm run dev`       | Dev server with hot reload |
| `npm run build`     | Production build           |
| `npm start`         | Serve the production build |
| `npm run typecheck` | `tsc --noEmit`             |

## Structure

All copy, pricing, variants, imagery and FAQs live in one file —
**[`lib/product.ts`](lib/product.ts)**. Edit content there, not in components.

```
app/
  layout.tsx          Root shell, Manrope font, metadata, ProductProvider
  page.tsx            Section order
  globals.css         Design tokens, resets, shared visual language
  icon.svg            Favicon
components/
  ProductProvider.tsx Shared state: variant, gallery frame, cart, live region
  ProductHero.tsx     Buy box; owns the ref the sticky bar watches
  Gallery.tsx         Main frame + five thumbnails (next/image, Shopify CDN)
  VariantPicker.tsx   Blue / Pink / Set radiogroup
  AddToCartButton.tsx CTA used in buy box, header and sticky bar
  StickyBar.tsx       Appears once the buy box scrolls away
  ProductTruth.tsx    Stands where reviews will go, once reviews exist
  Faq.tsx             Single-open accordion, measured heights
  …                   Features, Lifestyle, Steps, Shop, Why, FinalCta
lib/product.ts        Every piece of content and product data
```

Images are served from `cdn.shopify.com` via `next/image`
(`remotePatterns` in [next.config.mjs](next.config.mjs)). The page is statically
prerendered, so all copy is in the server-rendered HTML for search engines.

## Content rules

`lib/product.ts` is written so that every factual claim traces to the live
Shopify product or its photography. The following were **removed deliberately**
and must not be reintroduced without evidence:

- **Ratings, review counts, testimonials.** The store has 0 orders and 0
  customers. Any such claim would be fabricated, and fabricated reviews carry
  real FTC exposure. When real reviews exist, `ProductTruth.tsx` is the slot
  they belong in.
- **Medical or therapeutic claims.** Not a medical device. No pain relief,
  circulation, trigger-point or therapist comparisons.
- **The jade scraping board.** Mentioned in the supplier description but absent
  from all 11 product photos.
- **Free shipping.** Paid rates are configured in Shopify.

## Outstanding

- **Shipping zones do not cover the USA.** Shopify currently ships to Canada
  (`General shipping profile`) and India (`General profile`) only. The page says
  it ships within the USA. Until a US zone exists, US customers cannot check
  out. Fix in Settings → Shipping and delivery.
- **No refund, shipping or terms policy exists** on the store; only a privacy
  policy, which still contains unrendered Liquid variables.
- **Cart is local.** `addToCart` increments a counter. The Shopify Storefront
  API integration is specced but not wired — it needs a Storefront API token
  from the Headless channel in `.env.local`.
- Footer Contact link points at `#top`.
