"use client";

import { useEffect, useRef } from "react";

import { VALUE } from "@/lib/product";

const DEMO = VALUE.demo;

/**
 * The how-to-use block. Lives inside section 2 rather than becoming a section
 * of its own — showing the product being used is part of why someone wants it,
 * and the page holds to three sections.
 *
 * Autoplay is a preference, not an assumption: it starts muted and looping for
 * most visitors, and stays on its poster frame for anyone who has asked for
 * reduced motion. Native controls are always rendered, which is what satisfies
 * the WCAG 2.2.2 requirement for a pause mechanism on anything that moves for
 * more than five seconds.
 */
export function Demo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Rejects when the browser blocks autoplay; the poster and controls are
    // then the whole interface, which is a perfectly good outcome.
    video.play().catch(() => {});
  }, []);

  return (
    <div className="mt-12 grid items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <video
          ref={videoRef}
          src={DEMO.src}
          poster={DEMO.poster}
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

      <div>
        <p className="eyebrow text-accent">{DEMO.eyebrow}</p>
        <h3 className="mt-2 text-[length:var(--text-h2)] text-ink">{DEMO.heading}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{DEMO.deck}</p>

        {/* Doubles as the text alternative for the silent video above. */}
        <ol id="demo-steps" className="mt-6 grid gap-4">
          {DEMO.steps.map((step) => (
            <li key={step.num} className="flex gap-4">
              <span
                aria-hidden="true"
                className="num display grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-[13px] text-accent"
              >
                {step.num}
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold text-ink">{step.verb}</span>
                <span className="mt-0.5 block text-[15px] leading-snug text-muted">
                  {step.body}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
