/**
 * Single source of truth for the Relaxonus one-product store.
 *
 * Every factual claim here traces to the live Shopify product on
 * dk0tc0-cr.myshopify.com or to its own product photography.
 *
 * Permanently absent, and not to be reintroduced without evidence:
 *   - Star ratings and review counts typed in by hand. They are derived from
 *     the review data in lib/reviews.ts, so the figure always matches what is
 *     actually there. Real reviews go in REVIEWS; design fixtures live in a
 *     separate array that never reaches a production build.
 *   - Any strikethrough not backed by a real `compareAtPrice` in Shopify.
 *     Every reduction shown on the page is derived from live Storefront money
 *     (16 CFR 233); none of it is written down here. A former price must be
 *     one the variant was genuinely offered at.
 *   - Scarcity: 78,500 units are in stock. No "only N left", no stock bars.
 *   - Countdown behaviour is set by COUNTDOWN.mode in lib/campaign.ts. A
 *     fixed deadline must be a real one, and the prices must actually be
 *     restored in Shopify when it passes.
 *   - Medical vocabulary: relief, pain, therapeutic, circulation, tension,
 *     trigger point, soothe, recovery, chiropractor. Not a medical device.
 *     `treat` and `cure` appear ONLY inside the disclaimer strings below.
 *   - Free shipping and BNPL. Only Apple Pay and Google Pay are live.
 */

export type VariantKey = "blue" | "pink" | "set";

const CDN = "https://cdn.shopify.com/s/files/1/1006/0339/6459/files";
const V = "1787590071";

export const IMAGES = {
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
  /** Short label for the compact picker. */
  short: string;
  /** Exact Shopify option value for the `Color` option — casing matters. */
  optionValue: string;
  /** Shopify variant GID, for the Storefront cart API. */
  variantId: string;
  /** Swatch fill for the picker. */
  swatch: string;
  price: string;
  /**
   * Genuine reference price, shown struck through. Set only where a real one
   * exists — for the Duo that is two singles bought separately. Never a
   * former price the product was not actually offered at.
   */
  compareAt?: string;
  /** Massagers the customer receives. */
  units: number;
  frames: Frame[];
}

export const PRODUCT_NAME = "Relaxonus Neck & Shoulder Massager";

export const ADDED_MS = 1600;
/** Ceiling for the quantity stepper, enforced on the server too. */
export const MAX_QUANTITY = 10;

const ALT_IN_USE =
  "The massager hooked behind a model's neck, a column of rollers resting either side of the spine";
const ALT_ROLLERS = "Close-up of the six grooved rollers, arranged in two columns of three";
const ALT_PAIR = "The blue and the pink massager side by side — the two-massager Duo";

export const VARIANTS: Record<VariantKey, Variant> = {
  blue: {
    key: "blue",
    name: "Blue",
    short: "Blue",
    optionValue: "Blue",
    variantId: "gid://shopify/ProductVariant/53761385136491",
    swatch: "#A9D8E8",
    price: "$34.99",
    compareAt: "$40.99",
    units: 1,
    frames: [
      { url: "/products/blue/01-hero.webp", alt: "The blue Relaxonus massager standing against a pale wall" },
      { url: "/products/blue/02-in-use.webp", alt: ALT_IN_USE },
      { url: "/products/blue/03-rollers.webp", alt: ALT_ROLLERS },
      { url: "/products/blue/05-handles.webp", alt: "The two long handles of the blue massager" },
      { url: "/products/blue/04-lifestyle.webp", alt: "The blue massager resting against folded white towels" },
    ],
  },
  pink: {
    key: "pink",
    name: "Pink",
    short: "Pink",
    optionValue: "Pink",
    variantId: "gid://shopify/ProductVariant/53761385169259",
    swatch: "#F4BCD2",
    price: "$34.99",
    compareAt: "$40.99",
    units: 1,
    frames: [
      { url: "/products/pink/01-hero.webp", alt: "The pink Relaxonus massager standing against a pale wall" },
      { url: "/products/pink/05-in-use-side.webp", alt: ALT_IN_USE },
      { url: "/products/pink/03-rollers.webp", alt: "Close-up of the six grooved rollers in the pink frame" },
      { url: "/products/pink/06-handles.webp", alt: "The two long handles of the pink massager" },
      { url: "/products/pink/04-lifestyle.webp", alt: "The pink massager on a marble stand beside a rolled towel" },
    ],
  },
  set: {
    key: "set",
    name: "The Duo — Blue + Pink",
    short: "Both",
    optionValue: "A set",
    variantId: "gid://shopify/ProductVariant/53761385103723",
    swatch: "linear-gradient(105deg, #A9D8E8 0 50%, #F4BCD2 50% 100%)",
    price: "$47.99",
    compareAt: "$69.98",
    units: 2,
    frames: [
      { url: IMAGES.pair, alt: ALT_PAIR },
      { url: "/products/blue/01-hero.webp", alt: "The blue unit from the Duo" },
      { url: "/products/pink/01-hero.webp", alt: "The pink unit from the Duo" },
      { url: "/products/blue/02-in-use.webp", alt: ALT_IN_USE },
      { url: "/products/blue/03-rollers.webp", alt: ALT_ROLLERS },
    ],
  },
};

/** The Duo leads. Disclosed as arithmetic, never as a popularity claim. */
export const DEFAULT_TIER: VariantKey = "set";
export const TIER_ORDER: VariantKey[] = ["blue", "pink", "set"];

/**
 * Neutral on purpose. A compare-at may be a genuine former price of the same
 * variant, or a reference to what the parts cost separately — calling it
 * "regular price" would assert the former in both cases. The specific basis is
 * always spelled out in words next to the price.
 */
export const STRIKE_SR_PREFIX = "Compare at: ";

/* Campaign config — countdown, shipping, stock, upsell — lives in
   lib/campaign.ts. */

/* ================================ SECTION 1 =============================== */

export const HERO = {
  /**
   * States availability and dispatch, not scarcity. There are roughly 78,500
   * units on hand, so "limited stock" or "only N left" would be invented
   * urgency — the one kind that reliably draws enforcement. Real urgency comes
   * from the sale deadline instead, which is a genuine one.
   */
  eyebrow: "IN STOCK · SHIPS NOW",
  headline: "The neck massager that never needs charging.",
  sub: "Hook it over your shoulders, squeeze the handles, roll. Six grooved rollers do the work — powered entirely by you.",
  bullets: [
    "Ready the second you pick it up — nothing to charge, ever",
    "You set the pressure, from feather-light to firm",
    "Six rollers reach both sides of your neck at once",
    "Rollers pop out and rinse clean under the tap",
    "35 × 18 cm — fits a desk drawer, gym bag or suitcase",
  ],
  /** No deadline exists, so no deadline is claimed. */
  reassurance: "Secure checkout · Apple Pay & Google Pay · Shipping calculated at checkout",
  shipNote: "In stock — no waitlist, no pre-order.",
};

/* ================================ SECTION 2 =============================== */

export const VALUE = {
  eyebrow: "WHY PEOPLE PICK IT",
  heading: "Made for the ten minutes you actually get to yourself.",
  deck: "No motor, no app, no charging screen. Just six rollers and however hard you decide to squeeze.",
  cards: [
    {
      icon: "plug",
      title: "Nothing to charge",
      body: "No motor, no battery, no cable. It works the moment it leaves the box — and in a power cut.",
    },
    {
      icon: "grip",
      title: "You set the pressure",
      body: "Squeeze harder for firm, ease off for soft. Two long handles are the only control, and you can change it mid-roll.",
    },
    {
      icon: "rollers",
      title: "Six rollers, both sides",
      body: "Two columns of three grooved rollers, each spinning a full 360°, reaching either side of your neck at once.",
    },
    {
      icon: "rinse",
      title: "Rinses clean",
      body: "All six rollers pop off, rinse under a tap, dry, and click back on. The frame wipes down.",
    },
  ],
  /** The 3 biggest purchase hesitations, answered in one line each. */
  objections: [
    { q: "Does it need charging?", a: "No. There is no motor and no battery — it is powered entirely by you squeezing the handles." },
    { q: "How hard does it press?", a: "Exactly as hard as you squeeze. Firm, gentle, or anywhere between, decided by your hands." },
    { q: "Can I clean it?", a: "Yes. All six rollers pop off, rinse under a tap, and click back on." },
  ],
  /**
   * The demo, built from real photography of this exact product rather than
   * from generated footage — every frame here is the thing that ships.
   *
   * Each step owns the photograph that depicts it, so the picture and the
   * instruction can never drift apart. The step text doubles as the accessible
   * description of the image beside it.
   */
  demo: {
    eyebrow: "HOW TO USE IT",
    heading: "Hook it on. Squeeze. Roll.",
    deck: "Three moves, no setup, nothing to pair. The clip is silent — there is no motor in it to make a noise.",
    /** Supplier product footage, used unmodified. */
    src: "/video/how-to-use.mp4",
    label: "Demonstration of the Relaxonus massager being used on the neck and shoulders",
    steps: [
      {
        num: "01",
        verb: "Hook",
        body: "Over your neck or your shoulder, a column of rollers either side of the spine.",
        image: {
          url: "/products/blue/02-in-use.webp",
          alt: "The massager hooked behind a model's neck, a column of rollers resting either side of the spine, both hands on the handles",
        },
      },
      {
        num: "02",
        verb: "Squeeze",
        body: "Two long handles are the only control. However firm you want it, changed mid-roll.",
        image: {
          url: "/products/blue/05-handles.webp",
          alt: "Close-up of the two long looped handles that the hands grip and squeeze",
        },
      },
      {
        num: "03",
        verb: "Roll",
        body: "Up, down, repeat. Six grooved rollers, each spinning a full 360°.",
        image: {
          url: "/products/blue/03-rollers.webp",
          alt: "Close-up of the six grooved rollers, arranged in two columns of three",
        },
      },
    ],
  },

  /** The two mechanism diagrams, slid one after the other in the proof card. */
  mechanism: [
    {
      url: "/products/blue/06-rollers-spin.jpg",
      alt: "The rollers rotating on their axles, arrows showing the direction each one spins",
    },
    {
      url: "/products/blue/07-squeeze.jpg",
      alt: "Arrows showing the two handles squeezing inward to press the rollers together",
    },
  ],

  spec: {
    heading: "What you get",
    items: [
      ["Rollers", "6, grooved, 360° free-spin"],
      ["Layout", "Two columns of three"],
      ["Size", "35 × 18 cm"],
      ["Material", "PP frame, two long handles"],
      ["Power", "None — manual"],
    ],
  },
};

/* ------------------------------- Reviews ---------------------------------- */

/* Review types and data live in lib/reviews.ts, which keeps real reviews
   and design fixtures in separate arrays. */

export const REVIEWS_EMPTY = {
  heading: "No reviews yet — and we are not going to invent any.",
  body: "This product went live recently and nobody has written a review yet. When real customers do, their words appear here with their names on them. Until then, here is what you can check for yourself.",
  /** Only facts a visitor can verify from the listing and the photography. */
  proof: [
    ["6", "grooved rollers"],
    ["360°", "spin, every roller"],
    ["35 × 18", "centimetres"],
    ["0", "batteries, cables, apps"],
  ],
};

/* --------------------------------- Legal ---------------------------------- */

export const LEGAL = {
  /* `treat` and `cure` below are the whitelisted disclaimer strings.
     A literal banned-word grep will flag them — do not delete. */
  disclaimer:
    "Relaxonus is a manual massage roller and a comfort accessory. It is not a medical device and is not intended to diagnose, treat, cure or prevent any condition.",
  /**
   * The price disclosure is COMPUTED in <LegalStrip> from live Shopify money, not
   * written here. This string went stale the moment the prices changed — it
   * was still claiming the Duo cost $47.99 against $59.98 and that no sale was
   * in effect, while the page beside it showed a sale and different numbers.
   * A disclosure that contradicts the prices it discloses is worse than none,
   * so it is derived now and cannot drift again.
   */
  shipping: "Shipping is calculated at checkout. Prices in USD.",
  copyright: "© 2026 Relaxonus.",
};

export const SEO = {
  title: "Relaxonus — Manual 6-Roller Neck & Shoulder Massager",
  description:
    "Six grooved rollers, two handles, zero batteries. You set the pressure. $29.99 each, or $47.99 for the Blue + Pink Duo.",
};
