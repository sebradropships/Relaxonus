import { Faq } from "@/components/Faq";
import { Features } from "@/components/Features";
import { FinalCta } from "@/components/FinalCta";
import { Lifestyle } from "@/components/Lifestyle";
import { ProductHero } from "@/components/ProductHero";
import { ProductTruth } from "@/components/ProductTruth";
import { Shop } from "@/components/Shop";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Steps } from "@/components/Steps";
import { StickyBar } from "@/components/StickyBar";
import { Why } from "@/components/Why";
import { ANNOUNCEMENT } from "@/lib/product";

export default function Page() {
  return (
    <>
      <a className="skip-link" href="#top">
        Skip to product
      </a>

      <div className="announce">{ANNOUNCEMENT}</div>

      <SiteHeader />

      <main>
        <ProductHero />
        <Features />
        <ProductTruth />
        <Lifestyle />
        <Steps />
        <Shop />
        <Why />
        <Faq />
        <FinalCta />
      </main>

      <SiteFooter />
      <StickyBar />
    </>
  );
}
