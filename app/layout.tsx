import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";

import { SEO } from "@/lib/product";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  openGraph: {
    type: "website",
    title: SEO.title,
    description: SEO.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F6F3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
