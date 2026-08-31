import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";

import { SEO } from "@/lib/product";
import { STOREFRONT_URL } from "@/lib/site";

import "./globals.css";

/* Two families, no more. Manrope carries headings, prices and CTAs; Inter
   carries everything read in sentences. */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

/* metadataBase pins every generated URL to the headless storefront. Without a
   canonical here the only page claiming to be this product is the Shopify
   Online Store, which emits its own canonical on the myshopify domain. */
export const metadata: Metadata = {
  metadataBase: new URL(STOREFRONT_URL),
  title: SEO.title,
  description: SEO.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Relaxonus",
    title: SEO.title,
    description: SEO.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf7f2",
  /* No maximum-scale or user-scalable: pinch-zoom must stay available. */
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      {/* Bottom padding clears the sticky mobile purchase bar. */}
      <body className="max-[899px]:pb-24">{children}</body>
    </html>
  );
}
