/**
 * Single source of truth for the Relaxonus product page.
 *
 * Every factual claim here is traceable to the live Shopify product on
 * dk0tc0-cr.myshopify.com or to its product photography. Nothing is invented.
 *
 * Deliberately absent, and not to be re-added without evidence:
 *   - Ratings, review counts or testimonials. The store has 0 orders and
 *     0 customers, so any such claim would be fabricated.
 *   - Medical or therapeutic claims. This is not a medical device.
 *   - The "jade scraping board" from the supplier description. It appears in
 *     none of the 11 product photos.
 *   - Free shipping. Paid rates are configured in Shopify.
 */

export type VariantKey = "blue" | "pink" | "set";

const CDN = "https://cdn.shopify.com/s/files/1/1006/0339/6459/files";
const V = "1787590071";

/** Real product photography, straight from the Shopify CDN. */
export const IMAGES = {
  blueHero: `${CDN}/eaa68842-462e-4930-9a9c-5b8696495e80.jpg?v=${V}`,
  blueWall: `${CDN}/c5ed27dc-ca76-462b-b251-a6855074de68.jpg?v=${V}`,
  pinkHero: `${CDN}/f7bcb3d1-d852-4d1a-8b73-b3241dc79d21.jpg?v=${V}`,
  pinkWall: `${CDN}/1588d579-c738-4c5a-92b1-432842cb31a3.jpg?v=${V}`,
  inUse: `${CDN}/08c6bacf-86b5-40e3-9517-f861805c7d9b.jpg?v=${V}`,
  rollers: `${CDN}/ff510df4-4e35-44ec-91d9-edaec6486aa7.jpg?v=${V}`,
  rollersAngle: `${CDN}/4750759d-c4b3-453a-bfdc-1c09d8842b0e.jpg?v=${V}`,
  dimensions: `${CDN}/ab211fe7-fa1a-4e74-add9-e550de575700.jpg?v=${V}`,
  pair: `${CDN}/4c1ad1df-6abb-473c-b957-3e2aba0bc686.jpg?v=${V}`,
} as const;

export interface Frame {
  url: string;
  alt: string;
}

export interface Variant {
  key: VariantKey;
  /** Customer-facing name. */
  name: string;
  /** Exact Shopify option value for the `Color` option — casing matters. */
  optionValue: string;
  /** Shopify variant GID, for the Storefront cart API. */
  variantId: string;
  /** CSS background for swatches and the sticky bar thumbnail. */
  tint: string;
  price: string;
  /**
   * Genuine reference price, shown struck through. Only set where a real one
   * exists — for the 2-pack that is the cost of two singles bought separately.
   * Never a former price the product was not actually offered at.
   */
  compareAt?: string;
  /** Short line under the variant name. */
  meta: string;
  /** Gallery frames, leading with this option's own photograph. */
  frames: Frame[];
}

export const PRODUCT_NAME = "Relaxonus Neck Massager";
export const PRODUCT_TAGLINE =
  "Six grooved rollers and two long handles — hook it behind your neck, squeeze, and the pressure is as much as your own hands feel like giving.";

export const SET_TINT = "linear-gradient(90deg,#DCE9F7 50%,#F7DEE7 50%)";
export const BLUE_TINT = "#DCE9F7";
export const PINK_TINT = "#F7DEE7";

export const ADDED_MS = 1600;
export const STICKY_OFFSET = 40;

export const CTA_LABEL = "ADD TO CART";
export const CTA_ADDED = "ADDED ✓";

const ALT_IN_USE =
  "The massager hooked behind a model's neck, a column of rollers resting either side of the spine";
const ALT_ROLLERS =
  "Close-up of the six grooved rollers, arranged in two columns of three";
const ALT_SIZE = "The massager shown flat with its 35 by 18 centimetre dimensions marked";
const ALT_PAIR = "The blue and the pink massager side by side — the two-massager set";

export const VARIANTS: Record<VariantKey, Variant> = {
  blue: {
    key: "blue",
    name: "Blue",
    optionValue: "Blue",
    variantId: "gid://shopify/ProductVariant/53761385136491",
    tint: BLUE_TINT,
    price: "$29.99",
    meta: "One massager, soft blue frame",
    // Own photography, not the supplier's stock set.
    frames: [
      { url: "/products/blue/01-hero.webp", alt: "The blue Relaxonus massager standing against a pale wall, both looped handles visible" },
      { url: "/products/blue/02-in-use.webp", alt: ALT_IN_USE },
      { url: "/products/blue/03-rollers.webp", alt: ALT_ROLLERS },
      { url: "/products/blue/04-lifestyle.webp", alt: "The blue massager resting against folded white towels" },
      { url: "/products/blue/05-handles.webp", alt: "Detail of the two looped handles you squeeze to set the pressure" },
    ],
  },
  pink: {
    key: "pink",
    name: "Pink",
    optionValue: "Pink",
    variantId: "gid://shopify/ProductVariant/53761385169259",
    tint: PINK_TINT,
    price: "$29.99",
    meta: "One massager, soft pink frame",
    // Own photography, not the supplier's stock set.
    frames: [
      { url: "/products/pink/01-hero.webp", alt: "The pink Relaxonus massager standing against a pale wall, both looped handles visible" },
      { url: "/products/pink/02-in-use.webp", alt: "The pink massager held behind the neck, a column of rollers either side of the spine" },
      { url: "/products/pink/03-rollers.webp", alt: "Close-up of the six grooved rollers in the pink frame" },
      { url: "/products/pink/04-lifestyle.webp", alt: "The pink massager on a marble stand beside a rolled towel and a soap dispenser" },
      { url: "/products/pink/05-in-use-side.webp", alt: "The massager drawn across the back of the neck, seen from behind" },
      { url: "/products/pink/06-handles.webp", alt: "Detail of the two looped handles you squeeze to set the pressure" },
    ],
  },
  set: {
    key: "set",
    name: "Blue + Pink Set",
    optionValue: "A set",
    variantId: "gid://shopify/ProductVariant/53761385103723",
    tint: SET_TINT,
    price: "$47.99",
    /** Real reference price: what two singles cost separately (2 × $29.99). */
    compareAt: "$59.98",
    meta: "Two massagers, one of each color",
    // Leads with the only genuine two-colour shot, then one of each unit.
    frames: [
      { url: IMAGES.pair, alt: ALT_PAIR },
      { url: "/products/blue/01-hero.webp", alt: "The blue unit from the set, standing against a pale wall" },
      { url: "/products/pink/01-hero.webp", alt: "The pink unit from the set, standing against a pale wall" },
      { url: "/products/blue/02-in-use.webp", alt: ALT_IN_USE },
      { url: "/products/blue/03-rollers.webp", alt: ALT_ROLLERS },
    ],
  },
};

export const VARIANT_ORDER: VariantKey[] = ["blue", "pink", "set"];

/**
 * Supplier demonstration footage, re-encoded for the web.
 *
 * The source was 14.9MB at 5.09 Mbps with an audio track of unknown
 * provenance. This copy is silent, and two captioned segments were cut:
 * "6 eco-friendly TPR soft rollers" (an unsubstantiated material and
 * environmental claim) and "Lateral pressure relaxes the ligaments"
 * (an anatomical claim this product cannot make).
 */
export const DEMO_VIDEO = {
  src: "/video/relaxonus-demo.web.mp4",
  poster: "/video/relaxonus-demo-poster.jpg",
  width: 720,
  height: 720,
  durationSeconds: 18,
  heading: "It only does one thing",
  body: "Hook it behind your neck, draw the handles together, and roll. The harder you squeeze, the more pressure you get — that is the whole mechanism, and it is the reason there is nothing to charge.",
} as const;

export const SET_BADGE = "SAVE $11.99";

export const ANNOUNCEMENT = "No batteries • Six rollers • Ships within the USA";

export const EYEBROW = "MANUAL BY DESIGN";

export const BENEFITS = [
  "Six grooved rollers, free-spinning 360°",
  "You squeeze — you set the pressure",
  "Nothing to charge, pair, or plug in",
];

/** Only claims the store can substantiate today. */
export const TRUST_POINTS = [
  "Ships within the USA",
  "No batteries, no charging",
  "Apple Pay & Google Pay",
];

export interface Feature {
  title: string;
  body: string;
  tone: "blue" | "pink";
  icon: "target" | "square" | "diamond" | "rings";
}

export const FEATURES: Feature[] = [
  {
    title: "Six rollers",
    body: "Two columns of three, grooved, each spinning freely through a full 360 degrees.",
    tone: "blue",
    icon: "target",
  },
  {
    title: "Your pressure",
    body: "Squeeze the handles for firmer, ease off for lighter. Nothing else to set.",
    tone: "blue",
    icon: "square",
  },
  {
    title: "Nothing to charge",
    body: "No motor, no battery, no app, no timer. Ready the second you pick it up.",
    tone: "pink",
    icon: "diamond",
  },
  {
    title: "Comes apart",
    body: "The rollers are listed as removable and washable — take them off and rinse.",
    tone: "pink",
    icon: "rings",
  },
];

/**
 * Stands in for a reviews section until there are real reviews to show.
 * Builds confidence from product truth rather than invented praise.
 */
export const TRUTH_HEADING = "No motor. No app. No batteries.";
export const TRUTH_SUB =
  "Here is exactly what you are buying, in plain terms — the specification as the manufacturer lists it, and nothing more.";

export const TRUTH_CARDS = [
  {
    title: "The build",
    body: "A PP plastic frame in an open U, listed at 35 × 18cm, carrying six grooved plastic rollers.",
  },
  {
    title: "The pressure",
    body: "There are no settings. Draw the two long handles together for more, let them out for less.",
  },
  {
    title: "What it doesn't need",
    body: "No cable, no charging dock, no batteries to go flat. Pick it up and it works.",
  },
];

/**
 * Reviews section copy.
 *
 * The zero-state must never imply customers exist. It earns trust with things
 * that are verifiably true today instead.
 */
export const REVIEWS_COPY = {
  heading: "What buyers say",
  zeroHeading: "Reviews",
  zeroTitle: "No reviews yet — we only just opened.",
  zeroBody:
    "We could have filled this space with borrowed praise. Instead, here is what we can actually stand behind, and you can hold us to every line of it.",
  zeroPoints: [
    {
      label: "The spec is the pitch",
      body: "Six grooved rollers, 35 × 18cm, PP frame. Every number on this page comes off the manufacturer's sheet.",
    },
    {
      label: "Nothing to fail",
      body: "No motor, no battery, no firmware. There is very little here that can stop working.",
    },
    {
      label: "Priced without the theatre",
      body: "$30 for one, $50 for two. No inflated list price crossed out to manufacture a discount.",
    },
  ],
  zeroNote:
    "When reviews do appear here, they will be from verified buyers of this product and shown unedited — the good ones and the bad ones.",
} as const;

export interface Step {
  num: string;
  title: string;
  body: string;
  tint: "blue" | "sand" | "pink";
  image: Frame;
}

export const STEPS: Step[] = [
  {
    num: "01",
    title: "Hook it behind you",
    body: "Rest the open U at the back of your neck so a column of rollers sits on each side.",
    tint: "blue",
    image: { url: "/products/blue/02-in-use.webp", alt: ALT_IN_USE },
  },
  {
    num: "02",
    title: "Squeeze and roll",
    body: "Draw the handles together and roll slowly. More squeeze, more pressure — start light.",
    tint: "sand",
    image: { url: "/products/blue/03-rollers.webp", alt: ALT_ROLLERS },
  },
  {
    num: "03",
    title: "Then move it along",
    body: "The same grip works on shoulders, upper back, arms, calves and thighs.",
    tint: "pink",
    image: { url: "/products/pink/02-in-use.webp", alt: "The pink massager drawn across the back of the neck" },
  },
];

export interface Offer {
  variant: VariantKey;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  featured?: boolean;
}

export const SHOP_HEADING = "Pick your color — or take both";

export const OFFERS: Offer[] = [
  {
    variant: "blue",
    eyebrow: "SINGLE — $30",
    title: "The blue one",
    body: "One massager in soft blue. Six rollers, two long handles, nothing to plug in.",
    cta: "CHOOSE BLUE",
  },
  {
    variant: "pink",
    eyebrow: "SINGLE — $30",
    title: "The pink one",
    body: "The same tool in soft pink. Same six grooved rollers, same manual squeeze.",
    cta: "CHOOSE PINK",
  },
  {
    variant: "set",
    eyebrow: "TWO MASSAGERS — $50",
    title: "Blue and pink",
    body: "Two complete massagers, not a unit plus add-ons. One for the desk, one for the bag.",
    cta: "CHOOSE THE PAIR",
    featured: true,
  },
];

export const WHY_HEADING = "Why manual is the point";

export interface WhyRow {
  label: string;
  ours: string;
  theirs: string;
}

export const WHY_ROWS: WhyRow[] = [
  { label: "Pressure", ours: "However hard you squeeze", theirs: "Whatever the buttons offer" },
  { label: "Power", ours: "None needed", theirs: "A battery or a socket" },
  { label: "Ready to use", ours: "Pick it up", theirs: "Depends on charge" },
  { label: "Cleaning", ours: "Rollers lift out to rinse", theirs: "Limited by the electronics" },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "How do I actually use it?",
    a: "Hold the two long handles and rest the open U behind your neck, so a column of rollers sits on each side. Squeeze the handles to set the pressure, then draw it slowly up and down. Start light — the pressure only ever comes from your grip, so ease off whenever you want, and stop if anything hurts.",
  },
  {
    q: "Where on my body can I use it?",
    a: "Neck, shoulders, upper back, arms, calves and thighs. The frame is listed at 35cm × 18cm (about 13.8in × 7.1in), wide enough to use around an arm or a leg as well as behind your neck.",
  },
  {
    q: "Blue, pink, or the set — which should I pick?",
    a: "The two singles are the same massager and both are $30; color is the only difference. The set is $50 for two complete massagers, one blue and one pink — $10 less than two singles at $60. Pick it if you want one at the desk and one in the bag, or if one of them is going to someone else.",
  },
  {
    q: "What comes in the box?",
    a: "A single order is one massager in the color you choose. The set is two complete massagers — one blue unit and one pink unit — not one unit plus add-ons. Nothing to charge and nothing to assemble.",
  },
  {
    q: "What's it made of, and can I clean it?",
    a: "A PP plastic frame with grooved plastic rollers. The rollers are listed as removable and washable, so they come off for a rinse and go back on. The frame itself wipes down.",
  },
  {
    q: "Where do you ship?",
    a: "We ship within the USA. Shipping is calculated at checkout — we don't currently offer free shipping, and we'd rather say so here than surprise you on the last page.",
  },
  {
    q: "Is this a medical device?",
    a: "No. It's a simple manual roller tool for everyday comfort and relaxation — no motor, no heat, no vibration, no batteries. It isn't designed or sold to diagnose, treat or manage any condition. If you have a health concern, talk to a qualified professional before using it.",
  },
];

export const LIFESTYLE = {
  heading: "Five o'clock, shoulders down",
  body: "Hook it behind your neck at the desk, on the sofa, wherever you land — there's nothing to switch on first.",
  cta: "SEE HOW IT WORKS",
  image: {
    url: "/products/pink/05-in-use-side.webp",
    alt: "The massager held behind the neck, seen from behind",
  },
};

export const FINAL_CTA = {
  heading: "Six rollers, whenever your shoulders want them",
  body: "$30 for one, or $50 for the blue-and-pink pair instead of $60 for two singles.",
  cta: "CHOOSE YOURS",
};

export const SEO = {
  title: "Relaxonus Neck Massager — Manual 6-Roller Tool",
  description:
    "A fully manual neck and shoulder massager with six grooved rollers. Squeeze the handles to set your own pressure. $30 each, $50 for two.",
};

export const NAV_LINKS = [
  { label: "Shop", href: "#shop" },
  { label: "How it works", href: "#how" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

export const FOOTER_LINKS = [
  { label: "Shop", href: "#shop" },
  { label: "How it works", href: "#how" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#top" },
];
