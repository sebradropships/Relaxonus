import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";

import { SEO } from "@/lib/product";

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

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  openGraph: { type: "website", title: SEO.title, description: SEO.description },
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
