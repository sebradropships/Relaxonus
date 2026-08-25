import { Announce } from "@/components/Announce";
import { Compare } from "@/components/Compare";
import { Demo } from "@/components/Demo";
import { Faq } from "@/components/Faq";
import { Features } from "@/components/Features";
import { FinalCta } from "@/components/FinalCta";
import { Hero } from "@/components/Hero";
import { Lifestyle } from "@/components/Lifestyle";
import { Marquee } from "@/components/Marquee";
import { ProductProvider } from "@/components/ProductProvider";
import { Receipts } from "@/components/Receipts";
import { Shop } from "@/components/Shop";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Steps } from "@/components/Steps";
import { StickyBar } from "@/components/StickyBar";
import { TruthBlock } from "@/components/TruthBlock";
import { MARQUEE_A, MARQUEE_B } from "@/lib/product";
import { getProductCommerce } from "@/lib/shopify/product";

export default async function Page() {
  const commerce = await getProductCommerce();

  return (
    <ProductProvider commerce={commerce}>
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:border-[3px] focus:border-sp-chlorine focus:bg-sp-black focus:px-4 focus:py-2 focus:text-sp-paper"
      >
        Skip to product
      </a>

      <Announce />
      <SiteHeader />

      <main>
        <Hero />
        <Marquee items={MARQUEE_A} tone="pink" direction="left" />
        <Features />
        <Steps />
        <Demo />
        <TruthBlock />
        <Lifestyle />
        <Compare />
        <Receipts />
        <Shop />
        {/* Band B carries the value-and-logistics reel, not a repeat of band A —
            it self-substantiates the strikethrough wherever it scrolls past. */}
        <Marquee items={MARQUEE_B} tone="deep" direction="right" tilt />
        <Faq />
        <FinalCta />
      </main>

      <SiteFooter />
      <StickyBar />
    </ProductProvider>
  );
}
