import type { Frame, VariantKey } from "@/lib/product";

/* ==========================================================================
   REVIEW DATA
   Two sources, deliberately kept apart:

     REVIEWS       real customer reviews. Ships to production. Empty today.
     DEMO_REVIEWS  design fixtures. Never reaches a production bundle.

   `getReviews()` prefers real data and only falls back to fixtures in dev, so
   the same components render both and the layout can be worked on before a
   single order exists.
   ========================================================================== */

export interface Review {
  id: string;
  customerName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  text: string;
  /** ISO date string. */
  date: string;
  /** Platform the review was written on. Omit for this store's own customers. */
  source?: string;
  verifiedPurchase: boolean;
  variant: VariantKey;
  /** Customer photo — the UGC slot. */
  image?: Frame;
  helpfulCount?: number;
}

/**
 * Real reviews. Add them here and they render everywhere immediately: the
 * hero rating, the summary, the distribution bars and the cards all read from
 * this one array.
 */
export const REVIEWS: Review[] = [];

/* -------------------------------------------------------------------------
   DEMO FIXTURES — design data only.

   `process.env.NODE_ENV` is statically replaced at build time, so the
   production bundle drops this array entirely: it is not shipped, not
   downloaded, and cannot be rendered to a customer. The UI also stamps a
   visible DEMO badge on anything drawn from it, so a fixture can never be
   mistaken for a real review while you are working.
   ------------------------------------------------------------------------- */

const DEMO_REVIEWS: Review[] = [
  { id: "d1", customerName: "Hannah R.", rating: 5, title: "Better than the electric one I returned", text: "I bought a vibrating one first and sent it back. This does more because I control the pressure. Use it at my desk most afternoons.", date: "2026-08-24", verifiedPurchase: true, variant: "blue", helpfulCount: 12, image: { url: "/products/blue/02-in-use.webp", alt: "Demo customer photo" } },
  { id: "d2", customerName: "Marcus T.", rating: 5, title: "Zero setup", text: "Took it out of the box and used it. No charging, no app, no pairing. That is the whole appeal.", date: "2026-08-23", verifiedPurchase: true, variant: "set", helpfulCount: 8 },
  { id: "d3", customerName: "Priya S.", rating: 5, text: "Got the pair so there is one at home and one at the office. Worth it for the price difference.", date: "2026-08-22", verifiedPurchase: true, variant: "set", helpfulCount: 6 },
  { id: "d4", customerName: "Dan W.", rating: 4, title: "Good, takes a bit of practice", text: "First couple of goes I was squeezing too hard. Once you find the right pressure it is great.", date: "2026-08-21", verifiedPurchase: true, variant: "blue" },
  { id: "d5", customerName: "Chloe M.", rating: 5, title: "The rollers actually spin", text: "Was expecting them to be stiff. All six spin freely, which makes a real difference rolling up and down.", date: "2026-08-20", verifiedPurchase: true, variant: "pink", helpfulCount: 15, image: { url: "/products/pink/05-in-use-side.webp", alt: "Demo customer photo" } },
  { id: "d6", customerName: "Ben K.", rating: 5, text: "Lives in my gym bag. Weighs nothing and there is nothing to break.", date: "2026-08-19", verifiedPurchase: true, variant: "blue" },
  { id: "d7", customerName: "Aisha N.", rating: 5, title: "Bought a second one", text: "Liked the first one enough that I got the pair for my sister. She uses hers every evening.", date: "2026-08-18", verifiedPurchase: true, variant: "set", helpfulCount: 9 },
  { id: "d8", customerName: "Tom H.", rating: 4, text: "Does what it says. Wish the handles were slightly longer for my shoulders but no complaints otherwise.", date: "2026-08-17", verifiedPurchase: true, variant: "blue" },
  { id: "d9", customerName: "Sofia L.", rating: 5, title: "Easy to clean", text: "Rollers pop off and rinse under the tap in about ten seconds. Clicked straight back on.", date: "2026-08-16", verifiedPurchase: true, variant: "pink", helpfulCount: 4 },
  { id: "d10", customerName: "James O.", rating: 5, text: "Sceptical about a manual one. Converted. You get exactly as much pressure as you want.", date: "2026-08-15", verifiedPurchase: true, variant: "blue" },
  { id: "d11", customerName: "Nadia F.", rating: 5, title: "Perfect desk companion", text: "Sits in my drawer at work. Two minutes between meetings and I feel human again.", date: "2026-08-14", verifiedPurchase: true, variant: "pink", helpfulCount: 11 },
  { id: "d12", customerName: "Oliver B.", rating: 5, text: "Solid plastic, no creaking, no flex where you do not want it. Feels like it will last.", date: "2026-08-13", verifiedPurchase: true, variant: "set" },
  { id: "d13", customerName: "Grace P.", rating: 3, title: "Fine, but know what it is", text: "It works, but you are doing the work. If you want something that runs by itself this is not it.", date: "2026-08-12", verifiedPurchase: true, variant: "blue" },
  { id: "d14", customerName: "Ryan C.", rating: 5, text: "Nothing to charge is the selling point for me. Every other gadget I own is flat when I want it.", date: "2026-08-11", verifiedPurchase: true, variant: "blue", helpfulCount: 7 },
  { id: "d15", customerName: "Mei L.", rating: 5, title: "The duo is the one to get", text: "Barely more than one and you get both colours. No reason to buy a single.", date: "2026-08-10", verifiedPurchase: true, variant: "set", helpfulCount: 18, image: { url: "/products/blue/01-hero.webp", alt: "Demo customer photo" } },
  { id: "d16", customerName: "Elena V.", rating: 5, text: "Small enough for a suitcase. Took it away for a week and used it every night.", date: "2026-08-09", verifiedPurchase: true, variant: "pink" },
  { id: "d17", customerName: "Josh A.", rating: 5, title: "Reaches both sides at once", text: "Two columns of rollers means you are not doing one side then the other. Faster than using my hands.", date: "2026-08-08", verifiedPurchase: true, variant: "blue", helpfulCount: 5 },
  { id: "d18", customerName: "Farah D.", rating: 5, text: "Bought on the sale price. Would have been happy at full price too.", date: "2026-08-07", verifiedPurchase: true, variant: "set" },
];

/** True when the rendered reviews are fixtures rather than real customers. */
export function usingDemoReviews(): boolean {
  return REVIEWS.length === 0 && process.env.NODE_ENV === "development";
}

/** Real reviews if any exist, otherwise fixtures in dev and nothing in prod. */
export function getReviews(): Review[] {
  if (REVIEWS.length > 0) return REVIEWS;
  return process.env.NODE_ENV === "development" ? DEMO_REVIEWS : [];
}

/* --------------------------------- derived -------------------------------- */

export interface ReviewStats {
  count: number;
  average: number;
  /** Count per star, index 0 = 1 star. */
  distribution: number[];
  verifiedCount: number;
  withPhotos: number;
}

export function reviewStats(reviews: Review[]): ReviewStats {
  const distribution = [0, 0, 0, 0, 0];
  let total = 0;
  let verifiedCount = 0;
  let withPhotos = 0;

  for (const review of reviews) {
    distribution[review.rating - 1] += 1;
    total += review.rating;
    if (review.verifiedPurchase) verifiedCount += 1;
    if (review.image) withPhotos += 1;
  }

  return {
    count: reviews.length,
    average: reviews.length ? total / reviews.length : 0,
    distribution,
    verifiedCount,
    withPhotos,
  };
}
