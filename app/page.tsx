import { CartDrawer } from "@/components/CartDrawer";
import { Close } from "@/components/Close";
import { Hero } from "@/components/Hero";
import { ProductProvider } from "@/components/ProductProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyBar } from "@/components/StickyBar";
import { Value } from "@/components/Value";
import { getProductCommerce } from "@/lib/shopify/product";

/**
 * Three sections, in the order the decision is actually made:
 *
 *   1  Hero    — what it is, what it costs, and the buy button.
 *   2  Value   — why it is worth it, what is verifiable, what people ask.
 *   3  Close   — a second complete purchase point, plus required disclosures.
 *
 * Everything else on the page is chrome: a wordmark, a cart, and the sticky
 * mobile bar. There is deliberately no nav, no about, no blog and no footer
 * of links — every extra destination is a way out of the purchase.
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

      <SiteHeader />

      <main>
        <Hero />
        <Value />
        <Close />
      </main>

      <StickyBar />
      <CartDrawer />
    </ProductProvider>
  );
}
