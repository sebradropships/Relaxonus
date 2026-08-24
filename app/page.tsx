import { Demo } from "@/components/Demo";
import { Faq } from "@/components/Faq";
import { Features } from "@/components/Features";
import { FinalCta } from "@/components/FinalCta";
import { Lifestyle } from "@/components/Lifestyle";
import { ProductHero } from "@/components/ProductHero";
import { ProductProvider } from "@/components/ProductProvider";
import { ProductTruth } from "@/components/ProductTruth";
import { Reviews } from "@/components/Reviews";
import { Shop } from "@/components/Shop";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Steps } from "@/components/Steps";
import { StickyBar } from "@/components/StickyBar";
import { Why } from "@/components/Why";
import { ANNOUNCEMENT, VARIANTS, VARIANT_ORDER, type VariantKey } from "@/lib/product";
import { formatMoney } from "@/lib/money";
import { getProductCommerce } from "@/lib/shopify/product";
import type { ProductCommerce } from "@/lib/shopify/types";

/**
 * Live pricing is read once per render pass and handed down, so the server
 * components and the client context can never disagree about the price.
 */
function priceTable(commerce: ProductCommerce): Record<VariantKey, string> {
  const table = {} as Record<VariantKey, string>;
  for (const key of VARIANT_ORDER) {
    const live = commerce.variants?.[key];
    table[key] = live ? formatMoney(live.price) : VARIANTS[key].price;
  }
  return table;
}

export default async function Page() {
  const commerce = await getProductCommerce();
  const prices = priceTable(commerce);

  return (
    <ProductProvider commerce={commerce}>
      <a className="skip-link" href="#top">
        Skip to product
      </a>

      <div className="announce">{ANNOUNCEMENT}</div>

      <SiteHeader />

      <main>
        <ProductHero />
        <Features />
        <Demo />
        <ProductTruth />
        <Lifestyle />
        <Steps />
        <Shop prices={prices} />
        <Reviews />
        <Why />
        <Faq />
        <FinalCta />
      </main>

      <SiteFooter />
      <StickyBar />
    </ProductProvider>
  );
}
