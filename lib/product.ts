/**
 * Single source of truth for the Relaxonus product page.
 *
 * Every factual claim here traces to the live Shopify product on
 * dk0tc0-cr.myshopify.com or to its own product photography.
 *
 * Permanently absent, and not to be reintroduced without evidence:
 *   - Star ratings, review counts, testimonials, "X sold", "most popular".
 *     The store has 0 orders and 0 customers (16 CFR 465).
 *   - Any strikethrough other than the Duo's $59.98, which is the genuine
 *     cost of two singles bought separately (16 CFR 233).
 *   - Scarcity: 78,500 units are in stock. No countdowns, no stock bars.
 *   - Medical vocabulary: relief, pain, therapeutic, circulation, tension,
 *     trigger point, soothe, recovery, chiropractor. Not a medical device.
 *     `treat` and `cure` appear ONLY inside the two disclaimer strings below.
 *   - Free shipping, BNPL. Paid rates; only Apple Pay and Google Pay are live.
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
  /** Exact Shopify option value for the `Color` option — casing matters. */
  optionValue: string;
  /** Shopify variant GID, for the Storefront cart API. */
  variantId: string;
  /** Flat panel colour behind the gallery image. */
  panel: string;
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

export const PRODUCT_NAME = "Relaxonus Neck Massager";

export const ADDED_MS = 1600;
export const STICKY_OFFSET = 40;

const ALT_IN_USE =
  "The massager hooked behind a model's neck, a column of rollers resting either side of the spine";
const ALT_ROLLERS = "Close-up of the six grooved rollers, arranged in two columns of three";
const ALT_PAIR = "The blue and the pink massager side by side — the two-massager Duo";

export const VARIANTS: Record<VariantKey, Variant> = {
  blue: {
    key: "blue",
    name: "One — Blue",
    optionValue: "Blue",
    variantId: "gid://shopify/ProductVariant/53761385136491",
    panel: "var(--color-sp-chlorine)",
    price: "$29.99",
    units: 1,
    frames: [
      { url: "/products/blue/01-hero.webp", alt: "The blue Relaxonus massager standing against a pale wall" },
      { url: "/products/blue/02-in-use.webp", alt: ALT_IN_USE },
      { url: "/products/blue/03-rollers.webp", alt: ALT_ROLLERS },
      { url: "/products/blue/04-lifestyle.webp", alt: "The blue massager resting against folded white towels" },
    ],
  },
  pink: {
    key: "pink",
    name: "One — Pink",
    optionValue: "Pink",
    variantId: "gid://shopify/ProductVariant/53761385169259",
    panel: "var(--color-sp-bubblegum)",
    price: "$29.99",
    units: 1,
    frames: [
      { url: "/products/pink/01-hero.webp", alt: "The pink Relaxonus massager standing against a pale wall" },
      { url: "/products/pink/02-in-use.webp", alt: "The pink massager held behind the neck" },
      { url: "/products/pink/03-rollers.webp", alt: "Close-up of the six grooved rollers in the pink frame" },
      { url: "/products/pink/04-lifestyle.webp", alt: "The pink massager on a marble stand beside a rolled towel" },
    ],
  },
  set: {
    key: "set",
    name: "The Duo — Blue + Pink",
    optionValue: "A set",
    variantId: "gid://shopify/ProductVariant/53761385103723",
    panel:
      "linear-gradient(90deg, var(--color-sp-chlorine) 0 50%, var(--color-sp-bubblegum) 50% 100%)",
    price: "$47.99",
    compareAt: "$59.98",
    units: 2,
    frames: [
      { url: IMAGES.pair, alt: ALT_PAIR },
      { url: "/products/blue/01-hero.webp", alt: "The blue unit from the Duo" },
      { url: "/products/pink/01-hero.webp", alt: "The pink unit from the Duo" },
      { url: "/products/blue/02-in-use.webp", alt: ALT_IN_USE },
    ],
  },
};

/** The Duo is default-selected. Disclosed nudge, not a claim. */
export const DEFAULT_TIER: VariantKey = "set";
export const TIER_ORDER: VariantKey[] = ["blue", "pink", "set"];

export interface Tier {
  key: VariantKey;
  swatch: string;
  title: string;
  sub: string;
  perUnit: string;
  badge?: string;
}

export const TIERS: Record<VariantKey, Tier> = {
  blue: {
    key: "blue",
    swatch: "var(--color-sp-chlorine)",
    title: "ONE — BLUE",
    sub: "A single massager.",
    perUnit: "$29.99 per massager",
  },
  pink: {
    key: "pink",
    swatch: "var(--color-sp-bubblegum)",
    title: "ONE — PINK",
    sub: "A single massager.",
    perUnit: "$29.99 per massager",
  },
  set: {
    key: "set",
    swatch:
      "linear-gradient(90deg, var(--color-sp-chlorine) 0 50%, var(--color-sp-bubblegum) 50% 100%)",
    title: "THE DUO — BLUE + PINK",
    sub: "Two massagers. One for the desk, one for the sofa.",
    perUnit: "$24.00 per massager",
    // Arithmetic, not a popularity claim. The badge and the sum below it must
    // never be separated.
    badge: "BEST VALUE · SAVE $11.99",
  },
};

export const TIER_GROUP_LABEL = "PICK YOUR SETUP";

/** The substantiation the single strikethrough on this store rests on. */
export const BASIS_LINE =
  "Two singles bought separately cost $59.98. The Duo is $47.99 — you keep $11.99, about 20%.";
export const BASIS_TAG = "↳ two singles, bought separately";
export const STRIKE_SR_PREFIX = "Regular separate price, two singles bought separately: ";

/* ------------------------------ Announcements ----------------------------- */

export const ANNOUNCEMENTS = [
  "No battery. No app. No charging. Just squeeze.",
  "The Duo is $47.99 — two singles bought separately cost $59.98.",
  "Apple Pay and Google Pay at checkout. Shipping calculated at checkout.",
];

/* --------------------------------- Header --------------------------------- */

export const NAV_LINKS = [
  { label: "THE ROLLERS", href: "#rollers" },
  { label: "HOW IT WORKS", href: "#how" },
  { label: "COMPARE", href: "#compare" },
  { label: "RECEIPTS", href: "#receipts" },
  { label: "FAQ", href: "#faq" },
];

/* ---------------------------------- Hero ---------------------------------- */

export const HERO = {
  eyebrow: "MANUAL 6-ROLLER NECK + SHOULDER MASSAGER",
  srTitle: "Relaxonus manual six-roller neck and shoulder massager.",
  deck: "Six grooved rollers. Two handles. Your grip is the only setting there is.",
  microline:
    "Apple Pay and Google Pay at checkout, so you can pay without typing a card number. Shipping is calculated at checkout, before you pay. In stock — no waitlist, no pre-order.",
  bullets: [
    { emoji: "✊", text: "You set the pressure — squeeze harder, roll harder" },
    { emoji: "🔄", text: "Six grooved rollers, two columns of three, every one spins a full 360°" },
    { emoji: "🔌", text: "No motor, no battery, no cable. Nothing to charge, ever." },
    { emoji: "🚿", text: "Rollers pop out, rinse off, click back in" },
    { emoji: "📏", text: "35 × 18 cm PP frame. Blue or Pink." },
  ],
  stickers: ["6 ROLLERS", "ZERO BATTERIES"],
};

/* --------------------------------- Marquee -------------------------------- */

export const MARQUEE_A = [
  "6 ROLLERS", "360° SPIN", "ZERO BATTERIES", "YOU SET THE PRESSURE", "35 × 18 CM",
  "TWO COLUMNS OF THREE", "RINSE-CLEAN ROLLERS", "NOTHING TO CHARGE",
  "NO APP, NO CABLE, NO TIMER", "PP FRAME", "WORKS IN A POWER CUT",
];

export const MARQUEE_B = [
  "ONE MASSAGER $29.99", "THE DUO $47.99", "TWO SINGLES BOUGHT SEPARATELY COST $59.98",
  "$24.00 PER MASSAGER IN THE DUO", "APPLE PAY", "GOOGLE PAY",
  "SHIPPING CALCULATED AT CHECKOUT", "BLUE", "PINK", "IN STOCK", "NO WAITLIST",
  "NO PRE-ORDER", "PRICES IN USD",
];

/* -------------------------------- Features -------------------------------- */

export interface Feature {
  emoji: string;
  title: string;
  body: string;
  accent: boolean;
}

export const FEATURES_HEADING = "SIX ROLLERS. ZERO EXCUSES.";

export const FEATURES: Feature[] = [
  { emoji: "🔄", title: "SIX ROLLERS", body: "Two columns of three, grooved, each one spinning a full 360°.", accent: true },
  { emoji: "✊", title: "YOUR GRIP IS THE DIAL", body: "Squeeze hard for firm. Ease off for soft. No presets arguing with you.", accent: false },
  { emoji: "🔌", title: "NOTHING TO CHARGE", body: "No motor, no battery, no cable, no app. Nothing to plug in, ever.", accent: false },
  { emoji: "🚿", title: "ROLLERS COME OUT", body: "Pop them off, rinse, dry, click back on.", accent: true },
  { emoji: "📏", title: "35 × 18 CM", body: "Desk drawer, gym bag, sofa arm, suitcase. It goes.", accent: true },
  { emoji: "💙💗", title: "TWO COLOURWAYS", body: "Blue or Pink. Take both for $47.99 and skip the argument.", accent: false },
];

/* ---------------------------------- Steps --------------------------------- */

export const STEPS_HEADING = "THREE STEPS. THAT IS IT.";
export const STEPS_KICKER =
  "No setup. No pairing. No charging screen. It works the second you open the box.";

export const STEPS = [
  { num: "01", verb: "HOOK", body: "Over your neck or shoulder." },
  { num: "02", verb: "SQUEEZE", body: "Two handles. Your pressure." },
  { num: "03", verb: "ROLL", body: "Up, down, repeat." },
];

/* ---------------------------------- Demo ---------------------------------- */

export const DEMO = {
  src: "/video/relaxonus-demo.web.mp4",
  poster: "/video/relaxonus-demo-poster.jpg",
  eyebrow: "THE DEMO",
  heading: "WATCH THE ROLLERS SPIN.",
  deck: "Sound is off by default. It is a squeeze and a roll, and that is the whole product.",
  caption: "There is no motor in it, so there is no motor noise.",
  stickers: ["6 ROLLERS", "0 BATTERIES"],
};

/* ------------------------------ Truth block ------------------------------- */

export const TRUTH_HEADING = "HERE IS WHAT IT DOES NOT DO.";

export const TRUTH_CHIPS = [
  "NO MOTOR", "NO BATTERY", "NO CHARGING", "NO CABLE", "NO APP",
  "NO HEAT", "NO VIBRATION", "NO TIMER", "NO SPEED SETTINGS", "NO SUBSCRIPTION",
];

export const TRUTH_BODY =
  "What it is: a U-shaped PP frame, two long handles and six free-spinning grooved rollers. You hook it over your neck or shoulder, you squeeze, you roll. It is a comfort accessory, not a medical device, and it makes no claims about your body — it just does the same thing every time you pick it up.";

export const TRUTH_PAYOFF =
  "NOTHING IN IT CAN GO FLAT, EXPIRE, ASK TO BE PAIRED OR ASK FOR AN UPDATE.";

/* -------------------------------- Lifestyle ------------------------------- */

export const LIFESTYLE = {
  image: { url: "/products/pink/05-in-use-side.webp", alt: ALT_IN_USE },
  eyebrow: "3PM. STILL AT THE DESK.",
  heading: "HOOK IT ON. SQUEEZE. CARRY ON TYPING.",
  line: "One hand each side. No plug, no pause button, no fifteen-minute setup.",
};

/* -------------------------------- Comparison ------------------------------ */

export type Mark = "yes" | "no" | "varies";

export interface CompareRow {
  attribute: string;
  ours: { mark: Mark; value: string };
  powered: { mark: Mark; value: string };
  hands: { mark: Mark; value: string };
}

export const COMPARE_HEADING = "RELAXONUS VS. THE ALTERNATIVES.";

export const COMPARE_COLUMNS = ["RELAXONUS", "A BATTERY-POWERED MASSAGER", "YOUR OWN TWO HANDS"];

/**
 * Every row is phrased so a tick in our column is the good outcome.
 * Rows the category genuinely varies on say VARIES rather than asserting a
 * blanket NO — a false comparative claim is actionable under Lanham 43(a)
 * whether or not a competitor is named. Two rows concede outright.
 */
export const COMPARE_ROWS: CompareRow[] = [
  {
    attribute: "Nothing inside that can run out of charge",
    ours: { mark: "yes", value: "YES" },
    powered: { mark: "no", value: "NO" },
    hands: { mark: "yes", value: "YES" },
  },
  {
    attribute: "Nothing electronic inside at all",
    ours: { mark: "yes", value: "YES" },
    powered: { mark: "no", value: "NO" },
    hands: { mark: "yes", value: "YES" },
  },
  {
    attribute: "Six grooved rollers that free-spin 360°",
    ours: { mark: "yes", value: "SIX" },
    powered: { mark: "varies", value: "VARIES BY MODEL" },
    hands: { mark: "no", value: "NONE" },
  },
  {
    attribute: "Reaches both sides of the neck at once",
    ours: { mark: "yes", value: "TWO COLUMNS OF THREE" },
    powered: { mark: "varies", value: "VARIES BY MODEL" },
    hands: { mark: "no", value: "ONE SIDE AT A TIME" },
  },
  {
    attribute: "Pressure you set with your own grip",
    ours: { mark: "yes", value: "YES" },
    powered: { mark: "varies", value: "VARIES BY MODEL" },
    hands: { mark: "yes", value: "YES" },
  },
  {
    attribute: "Parts you can take off and rinse",
    ours: { mark: "yes", value: "ALL SIX ROLLERS" },
    powered: { mark: "varies", value: "VARIES BY MODEL" },
    hands: { mark: "no", value: "NOT APPLICABLE" },
  },
  {
    attribute: "Works without you doing the work",
    ours: { mark: "no", value: "NO — YOU DO THE WORK" },
    powered: { mark: "yes", value: "YES" },
    hands: { mark: "no", value: "NO" },
  },
  {
    attribute: "Costs nothing",
    ours: { mark: "no", value: "NO — $29.99" },
    powered: { mark: "no", value: "NO" },
    hands: { mark: "yes", value: "FREE" },
  },
];

export const COMPARE_FOOTNOTE =
  "We are describing battery-powered massagers as a category, by what “battery-powered” means — not any specific brand or model. Feature sets vary a lot, which is why three rows say VARIES; check the spec of anything you are comparing. And yes, we gave ourselves two crosses. Your own two hands beat us on price and they always will.";

/* --------------------------------- Receipts -------------------------------- */

export const RECEIPTS = {
  eyebrow: "RECEIPTS",
  heading: "EVERYTHING WE CAN ACTUALLY PROVE.",
  line: "No customer reviews yet, and we are not going to invent any. Here is what you can check instead.",
  /** countUp runs only on real measurable facts, never on anything order-shaped. */
  specs: [
    { value: "6", label: "GROOVED ROLLERS", countUp: true },
    { value: "2 × 3", label: "TWO COLUMNS OF THREE", countUp: false },
    { value: "360°", label: "FREE SPIN, EVERY ROLLER", countUp: true },
    { value: "35 × 18", label: "CENTIMETRES, PP FRAME", countUp: true },
    { value: "0", label: "BATTERIES, CABLES, APPS", countUp: false },
  ],
  tiles: [
    {
      title: "PAYING FOR IT",
      body: "Apple Pay and Google Pay are live at checkout, so you can pay without typing a card number. Shipping is calculated at checkout, before you pay.",
    },
    {
      title: "WHAT YOU GET",
      body: "A U-shaped PP frame, two long handles and six removable grooved rollers. 35 × 18 cm. Nothing else in the box, because nothing else is needed.",
    },
    {
      // `treat`/`cure` are whitelisted here and in the footer disclaimer only.
      title: "Important: NOT A MEDICAL DEVICE",
      body: "Relaxonus is a comfort accessory. It is not a medical device, it is not a treatment, and we make no health claims about it.",
    },
  ],
  closing: "When real customers write real things, they will appear here with their names on them.",
};

/* ----------------------------------- Shop ---------------------------------- */

export const SHOP_HEADING = "PICK A SIDE. OR DON'T.";

export interface ShopCard {
  key: VariantKey;
  emoji: string;
  title: string;
  sub: string;
  perUnit: string;
  cta: string;
  badge?: string;
}

export const SHOP_CARDS: ShopCard[] = [
  { key: "blue", emoji: "💙", title: "RELAXONUS — BLUE", sub: "One massager.", perUnit: "$29.99 per massager", cta: "ADD BLUE" },
  { key: "pink", emoji: "💗", title: "RELAXONUS — PINK", sub: "One massager.", perUnit: "$29.99 per massager", cta: "ADD PINK" },
  { key: "set", emoji: "💙💗", title: "THE DUO — BLUE + PINK", sub: "Two massagers. One for the desk, one for the sofa.", perUnit: "$24.00 per massager", cta: "ADD BOTH", badge: "BEST VALUE · SAVE $11.99" },
];

/* ----------------------------------- FAQ ----------------------------------- */

export const FAQ_HEADING = "THE AWKWARD ONES";

export const FAQS = [
  { q: "Does it need charging?", a: "No. There is no motor and no battery. It works the moment it is out of the box, and it is powered entirely by you squeezing the handles." },
  { q: "How hard does it press?", a: "Exactly as hard as you squeeze. The two long handles are the only control — firm, gentle, or anywhere in between, decided by your hands, and you can change it mid-roll." },
  { q: "How many rollers are there?", a: "Six. Two columns of three, grooved, and every one of them free-spins a full 360°." },
  { q: "Can I clean it?", a: "Yes. All six rollers pop off, rinse under a tap, dry, and click back on. The PP frame wipes down." },
  { q: "How big is it?", a: "35 × 18 cm. It is a U-shaped PP plastic frame with two long handles, and it fits a desk drawer or a gym bag." },
  { q: "Blue or Pink?", a: "Both exist and they are the same product in two colours. One is $29.99. The Duo — one of each — is $47.99." },
  { q: "Why is the Duo $47.99 when it shows $59.98 crossed out?", a: "Because two singles at $29.99 each is $59.98. That $59.98 is the arithmetic, not an old price. There is no sale on this store and never has been — the Duo is simply cheaper than buying two on their own." },
  { q: "What does shipping cost?", a: "Shipping is calculated at checkout based on your address, and you see the exact amount before you pay anything." },
  { q: "How can I pay?", a: "Apple Pay and Google Pay are available at checkout." },
  { q: "Why are there no reviews?", a: "Because nobody has written one yet. We would rather show you an empty review section than a fake full one." },
  { q: "Is this a medical device?", a: "No. It is a manual massage roller and a comfort accessory. It is not intended to diagnose, treat, cure or prevent anything, and we make no health claims about it." },
];

/* --------------------------------- Final CTA ------------------------------- */

export const FINAL_CTA = {
  headingA: "STOP READING.",
  headingB: "START SQUEEZING.",
  stickers: ["6 ROLLERS", "0 BATTERIES"],
  microline:
    "The Duo is $47.99; two singles bought separately cost $59.98. Apple Pay and Google Pay at checkout. Shipping calculated at checkout. Prices in USD. Not a medical device.",
};

/* ---------------------------------- Footer --------------------------------- */

export const FOOTER = {
  tagline: "Six rollers. Two handles. Zero batteries.",
  columns: [
    { title: "SHOP", links: [
      { label: "Blue — $29.99", href: "#shop" },
      { label: "Pink — $29.99", href: "#shop" },
      { label: "The Duo — $47.99", href: "#shop" },
      { label: "How it works", href: "#how" },
    ]},
    { title: "HELP", links: [
      { label: "FAQ", href: "#faq" },
      { label: "Compare", href: "#compare" },
      { label: "Receipts", href: "#receipts" },
    ]},
  ],
  legal:
    "Relaxonus is a manual massage roller and a comfort accessory. It is not a medical device and is not intended to diagnose, treat, cure or prevent any condition. The only price reduction anywhere on this store is The Duo at $47.99 against the $59.98 that two single massagers cost when bought separately; no other product is discounted and no sale is in effect. Shipping is calculated at checkout. Prices in USD.",
  copyright: "© 2026 Relaxonus.",
};

export const SEO = {
  title: "Relaxonus — Manual 6-Roller Neck Massager",
  description:
    "Six grooved rollers, two handles, zero batteries. You set the pressure. $29.99 each, or $47.99 for the Blue + Pink Duo.",
};
