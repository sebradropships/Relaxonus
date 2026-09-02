import type { MetadataRoute } from "next";

/**
 * Web app manifest — the home-screen and installed-app identity.
 *
 * `favicon.ico`, `icon.svg` and `apple-icon.png` sit in this directory and
 * Next emits their <link> tags from the file convention, so they are
 * deliberately not repeated here; this file exists for the 192/512 icons,
 * which have no file convention of their own.
 *
 * `theme_color` matches the `themeColor` in layout.tsx. The two are read by
 * different surfaces and looking different in each is the usual way this
 * drifts.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Relaxonus",
    short_name: "Relaxonus",
    description:
      "Manual 6-roller neck and shoulder massager. You set the pressure — no batteries, no charging.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#faf7f2",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      /* Separate maskable entry: Android crops to its own shape, and an "any"
         icon cropped that way loses the mark's edges. */
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
