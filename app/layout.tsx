import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Mono, Space_Grotesk } from "next/font/google";

import { MOTION_BOOTSTRAP } from "@/components/Motion";
import { SEO } from "@/lib/product";

import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  variable: "--font-bricolage",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  openGraph: { type: "website", title: SEO.title, description: SEO.description },
};

export const viewport: Viewport = {
  themeColor: "#0B0B10",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${spaceGrotesk.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before paint, so the page never starts animating and then stops. */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOTSTRAP }} />
      </head>
      <body className="pb-0 min-[899px]:pb-0 max-[899px]:pb-28">{children}</body>
    </html>
  );
}
