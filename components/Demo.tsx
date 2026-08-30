"use client";

import { useEffect, useRef } from "react";

import { VALUE } from "@/lib/product";

const DEMO = VALUE.demo;

/**
 * The how-to-use section: the clip leads, the three steps sit beneath it.
 *
 * The clip is silent — there is no motor in the product to make a noise — so
 * it carries no audio and needs no captions. It is video-only prerecorded
 * content, which WCAG 1.2.1 requires a text alternative for: the numbered
 * steps ARE that alternative, and the video points at them with
 * aria-describedby rather than leaving the relationship implied.
 *
 * Autoplay is a preference, not an assumption. It starts muted and looping for
 * most visitors and stays on its first frame for anyone who has asked for
 * reduced motion. Native controls always render, which is what satisfies the
 * WCAG 2.2.2 requirement for a pause mechanism on anything moving longer than
 * five seconds.
 */
export function Demo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Rejects when the browser blocks autoplay; the first frame and the
    // controls are then the whole interface, which is a fine outcome.
    video.play().catch(() => {});
  }, []);

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow text-accent">{DEMO.eyebrow}</p>
        <h2 className="mt-3 text-[length:var(--text-h2)] text-ink">{DEMO.heading}</h2>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">{DEMO.deck}</p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-line bg-surface">
        <video
          ref={videoRef}
          src={DEMO.src}
          preload="metadata"
          muted
          loop
          playsInline
          controls
          aria-label={DEMO.label}
          aria-describedby="demo-steps"
          className="block aspect-video w-full bg-sand object-cover"
        />
      </div>

      {/* Doubles as the text alternative for the silent clip above. */}
      <ol
        id="demo-steps"
        className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-3 sm:gap-6"
      >
        {DEMO.steps.map((step) => (
          <li key={step.num} className="flex gap-4 sm:flex-col sm:gap-3">
            <span
              aria-hidden="true"
              className="num display grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-[14px] text-accent"
            >
              {step.num}
            </span>
            <span className="min-w-0">
              <span className="block text-[16px] font-semibold text-ink">{step.verb}</span>
              <span className="mt-1 block text-[15px] leading-relaxed text-muted">
                {step.body}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
