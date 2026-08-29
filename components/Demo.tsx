"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { VALUE } from "@/lib/product";

const DEMO = VALUE.demo;
const STEP_MS = 3600;

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4.5 2.8v10.4a.6.6 0 0 0 .93.5l8-5.2a.6.6 0 0 0 0-1l-8-5.2a.6.6 0 0 0-.93.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="4" y="3" width="3" height="10" rx="1" />
      <rect x="9" y="3" width="3" height="10" rx="1" />
    </svg>
  );
}

/**
 * The how-to-use demo, assembled from real photographs of this product.
 *
 * It advances on its own so it reads as a demonstration rather than a
 * gallery, which puts it under WCAG 2.2.2 — anything moving for more than five
 * seconds needs a mechanism to stop it. Three of them are provided: an
 * explicit pause button, an automatic pause whenever a pointer or the keyboard
 * is inside the block, and a permanent stop the moment the visitor picks a
 * step themselves. It also starts paused for anyone who has asked for reduced
 * motion, so it never moves unrequested for them.
 */
export function Demo() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  /* Distinct from `playing`: a hover or a focus suspends the timer without
     overwriting the visitor's own play/pause choice. */
  const [suspended, setSuspended] = useState(false);
  const region = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing || suspended) return;
    const id = setInterval(() => setActive((i) => (i + 1) % DEMO.steps.length), STEP_MS);
    return () => clearInterval(id);
  }, [playing, suspended]);

  /* Choosing a step is a deliberate act — stop advancing and leave it stopped. */
  const choose = useCallback((index: number) => {
    setActive(index);
    setPlaying(false);
  }, []);

  const step = DEMO.steps[active];

  return (
    <div
      ref={region}
      role="group"
      aria-roledescription="demonstration"
      aria-label={DEMO.label}
      onMouseEnter={() => setSuspended(true)}
      onMouseLeave={() => setSuspended(false)}
      onFocus={() => setSuspended(true)}
      onBlur={(event) => {
        if (!region.current?.contains(event.relatedTarget as Node)) setSuspended(false);
      }}
      className="mt-12 grid items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10"
    >
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="relative aspect-[4/3] sm:aspect-video">
          {/* Keyed so each change is a fresh one-shot fade, never a loop. */}
          <Image
            key={step.image.url}
            src={step.image.url}
            alt={step.image.alt}
            fill
            sizes="(max-width: 1023px) 100vw, 620px"
            className="fade object-cover"
          />
        </div>

        {/* Progress rail. Fills only while the demo is genuinely advancing. */}
        <div className="absolute inset-x-0 bottom-0 flex gap-1 p-3">
          {DEMO.steps.map((item, index) => (
            <span
              key={item.num}
              aria-hidden="true"
              className={`h-1 flex-1 rounded-full transition-colors ${
                index === active ? "bg-accent" : "bg-white/55"
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow text-accent">{DEMO.eyebrow}</p>
          <button
            type="button"
            onClick={() => setPlaying((on) => !on)}
            aria-pressed={playing}
            className="tap inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3 text-[12px] font-medium text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
            {playing ? "Pause" : "Play"}
          </button>
        </div>

        <h3 className="mt-2 text-[length:var(--text-h2)] text-ink">{DEMO.heading}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{DEMO.deck}</p>

        <ol className="mt-6 grid gap-2">
          {DEMO.steps.map((item, index) => {
            const current = index === active;
            return (
              <li key={item.num}>
                <button
                  type="button"
                  onClick={() => choose(index)}
                  aria-current={current ? "step" : undefined}
                  className={`flex w-full gap-4 rounded-xl border p-3 text-left transition-colors ${
                    current
                      ? "border-accent bg-accent-soft"
                      : "border-transparent hover:border-line-strong hover:bg-surface"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`num display grid size-9 shrink-0 place-items-center rounded-full text-[13px] transition-colors ${
                      current ? "bg-accent text-white" : "bg-accent-soft text-accent"
                    }`}
                  >
                    {item.num}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold text-ink">{item.verb}</span>
                    <span className="mt-0.5 block text-[15px] leading-snug text-muted">
                      {item.body}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
