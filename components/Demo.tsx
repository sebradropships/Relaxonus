"use client";

import { useEffect, useRef } from "react";

import { DEMO } from "@/lib/product";

/**
 * Controls are always visible, not focus-only, so a mouse user has a
 * discoverable pause affordance (WCAG 2.2.2). With motion off it never
 * autoplays — the poster frame and the play button are the whole interface.
 */
export function Demo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (document.documentElement.dataset.motion === "off") return;
    video.play().catch(() => {});
  }, []);

  return (
    <section className="sp-section">
      <div className="sp-shell">
        <p className="sp-mono text-[13px] text-sp-mist">{DEMO.eyebrow}</p>
        <h2 className="mt-3 text-[length:var(--text-display-l)] text-sp-paper">{DEMO.heading}</h2>
        <p className="mt-4 max-w-[60ch] text-xl text-sp-paper">{DEMO.deck}</p>

        <div className="relative mx-auto mt-10 max-w-[900px]">
          <span
            className="sp-sticker sp-display absolute -left-3 -top-4 z-10 border-[3px] border-sp-black bg-sp-bubblegum px-3 py-1.5 text-sm text-sp-ink"
            style={{ animationDelay: "180ms" }}
          >
            {DEMO.stickers[0]}
          </span>
          <span
            className="sp-sticker sp-display absolute -bottom-4 -right-3 z-10 border-[3px] border-sp-black bg-sp-chlorine px-3 py-1.5 text-sm text-sp-ink"
            style={{ animationDelay: "900ms" }}
          >
            {DEMO.stickers[1]}
          </span>

          <video
            ref={videoRef}
            src={DEMO.src}
            poster={DEMO.poster}
            preload="metadata"
            muted
            loop
            playsInline
            controls
            aria-label="Demonstration of the Relaxonus neck massager being used"
            className="block w-full border-[3px] border-sp-paper bg-sp-carbon"
            style={{ boxShadow: "10px 10px 0 var(--color-sp-chlorine)" }}
          />
        </div>

        <p className="sp-disclosure mt-5 text-center text-sp-mist">{DEMO.caption}</p>
      </div>
    </section>
  );
}
