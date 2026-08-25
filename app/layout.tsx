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
      <body className="max-[899px]:pb-28">
        {/*
          First child of <body>, not <head>: React 19 hoists scripts out of
          head, which broke hydration and then wiped the attribute the script
          had just set. Here it still runs before any content paints.
        */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOTSTRAP }} />
        {children}
      </body>
    </html>
  );
}
