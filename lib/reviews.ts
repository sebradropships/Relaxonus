import type { Frame, VariantKey } from "@/lib/product";

/* ==========================================================================
   REVIEW DATA
   Two sources, deliberately kept apart:

     REVIEWS       real customer reviews. Ships to production.
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
  /** ISO date string. Optional: carried-over reviews keep no date, and the
      card renders none. */
  date?: string;
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
export const REVIEWS: Review[] = [
  { id: "r1", customerName: "Sarah M.", rating: 5, text: "Really comfortable to use after a long day. I like how easy it is to fit into my evening routine.", verifiedPurchase: true, variant: "blue" },
  { id: "r2", customerName: "Daniel R.", rating: 5, text: "The design is simple and easy to use. Feels great around my neck and shoulders.", verifiedPurchase: true, variant: "blue" },
  { id: "r3", customerName: "Emily T.", rating: 4, text: "Nice product and very easy to operate. The massage feels relaxing, especially after sitting at my desk all day.", verifiedPurchase: true, variant: "pink" },
  { id: "r4", customerName: "Michael K.", rating: 5, text: "Honestly one of my favorite things to use after work. Takes very little effort to set up.", verifiedPurchase: true, variant: "set", helpfulCount: 9 },
  { id: "r5", customerName: "Olivia P.", rating: 5, text: "Love how portable it is. I can use it while watching TV without having to make a whole routine around it.", verifiedPurchase: true, variant: "pink", helpfulCount: 14 },
  { id: "r6", customerName: "Jessica L.", rating: 4, text: "Good quality and comfortable around my shoulders. The controls are straightforward too.", verifiedPurchase: true, variant: "pink" },
  { id: "r7", customerName: "Ryan S.", rating: 5, text: "Really impressed with how easy this is to use. Great addition to my nightly wind-down routine.", verifiedPurchase: true, variant: "blue" },
  { id: "r8", customerName: "Sophia A.", rating: 5, text: "The massage feels really soothing. I have been using it regularly in the evenings.", verifiedPurchase: true, variant: "pink", helpfulCount: 6 },
  { id: "r9", customerName: "Ethan W.", rating: 4, text: "Compact, convenient and easy to use. Definitely useful after a long day at my desk.", verifiedPurchase: true, variant: "blue" },
  { id: "r10", customerName: "Mia T.", rating: 5, text: "Very relaxing experience. I like being able to use it at home whenever I have some downtime.", verifiedPurchase: true, variant: "set" },
  { id: "r11", customerName: "James B.", rating: 5, text: "Setup takes practically no time. The neck and shoulder area feels nicely targeted.", verifiedPurchase: true, variant: "blue", helpfulCount: 11 },
  { id: "r12", customerName: "Grace N.", rating: 4, text: "Good product overall. It is comfortable and does not take up much space when stored.", verifiedPurchase: true, variant: "pink" },
  { id: "r13", customerName: "Noah D.", rating: 5, text: "Really like the convenience. I can use it while sitting on the couch and relaxing.", verifiedPurchase: true, variant: "blue" },
  { id: "r14", customerName: "Ava R.", rating: 5, text: "The design makes it really easy to position. It has quickly become part of my evening routine.", verifiedPurchase: true, variant: "pink", helpfulCount: 7 },
  { id: "r15", customerName: "Liam C.", rating: 4, text: "Feels well made and works as expected. I especially like using it after spending hours at my computer.", verifiedPurchase: true, variant: "blue" },
  { id: "r16", customerName: "Isabella H.", rating: 5, text: "Very relaxing and simple to operate. I appreciate not having to deal with complicated settings.", verifiedPurchase: true, variant: "set" },
  { id: "r17", customerName: "Lucas F.", rating: 5, text: "Great little addition to my home setup. Easy to use whenever my neck and shoulders feel tired.", verifiedPurchase: true, variant: "blue" },
  { id: "r18", customerName: "Chloe S.", rating: 4, text: "Nice and convenient. The massage feels pleasant and the device is easy to handle.", verifiedPurchase: true, variant: "pink" },
  { id: "r19", customerName: "Benjamin J.", rating: 5, text: "I have been enjoying this after work. It has become part of my way of switching off for the evening.", verifiedPurchase: true, variant: "set", helpfulCount: 5 },
  { id: "r20", customerName: "Amelia K.", rating: 5, text: "Really happy with the overall design and experience. Comfortable and convenient.", verifiedPurchase: true, variant: "pink" },
  { id: "r21", customerName: "Henry P.", rating: 4, text: "Good product for relaxing at home. I like that it is straightforward and does not require much setup.", verifiedPurchase: true, variant: "blue" },
  { id: "r22", customerName: "Lily V.", rating: 5, text: "Feels great after a busy day. I especially enjoy using it while watching a movie.", verifiedPurchase: true, variant: "pink" },
  { id: "r23", customerName: "Alexander M.", rating: 5, text: "Very easy to use and convenient to keep around. The massage experience is really enjoyable.", verifiedPurchase: true, variant: "set", helpfulCount: 8 },
  { id: "r24", customerName: "Ella G.", rating: 4, text: "Overall, a solid product. Comfortable, simple and easy to incorporate into my routine.", verifiedPurchase: true, variant: "blue" },
  { id: "r25", customerName: "Jack T.", rating: 5, text: "Really like the convenience of having a massager at home. It takes only a few minutes to get started.", verifiedPurchase: true, variant: "blue" },
  { id: "r26", customerName: "Harper E.", rating: 5, text: "Feels premium and works nicely for my relaxation routine. I have been using it consistently.", verifiedPurchase: true, variant: "set", helpfulCount: 12 },
  { id: "r27", customerName: "Ryan P.", rating: 2, text: "The product is fairly easy to use and the massage feels pleasant, but it was not quite as powerful as I personally expected.", verifiedPurchase: true, variant: "blue" },
];

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
