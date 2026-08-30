import { CartDrawer } from "@/components/CartDrawer";
import { Hero } from "@/components/Hero";
import { LegalStrip } from "@/components/LegalStrip";
import { ProductProvider } from "@/components/ProductProvider";
import { SaleBanner } from "@/components/SaleBanner";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyBar } from "@/components/StickyBar";
import { Value } from "@/components/Value";
import { getProductCommerce } from "@/lib/shopify/product";

/**
 * Two sections, in the order the decision is actually made:
 *
 *   1  Hero   — what it is, what it costs, and the buy button.
 *   2  Value  — the demonstration, why it is worth it, what people ask.
 *
 * The hero's buy box is now the only purchase point on the page, which is
 * what makes the sticky mobile bar load-bearing rather than a convenience:
 * once the hero scrolls away it is the sole route to the cart.
 *
 * Everything else is chrome — a wordmark, a cart, the sale strip, and the
 * required disclosures. No nav, no about, no footer of links: every extra
 * destination is a way out of the purchase.
 */
export default async function Page() {
  const commerce = await getProductCommerce();

  return (
    <ProductProvider commerce={commerce}>
      <a
        href="#buy"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to buy
      </a>

      {/* Renders only while a genuine discount is live in Shopify AND the
          deadline is still ahead. */}
      <SaleBanner />
      <SiteHeader />

      <main>
        <Hero />
        <Value />
      </main>

      <LegalStrip />
      <StickyBar />
      <CartDrawer />
    </ProductProvider>
  );
}
