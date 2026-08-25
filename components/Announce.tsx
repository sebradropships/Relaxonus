"use client";

import { useEffect, useRef, useState } from "react";

import { ANNOUNCEMENTS } from "@/lib/product";

/**
 * Sticky announcement bar.
 *
 * All three messages are always in the DOM. Messages 2 and 3 carry the pricing
 * basis and the payment marks — material information that must never be
 * silently dropped — so with motion off they render together as one static
 * scrollable row rather than cycling.
 */
export function Announce() {
  const [index, setIndex] = useState(0);
  const [cycling, setCycling] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);

  /* Publish the real height so the sticky header sits directly beneath it.
     The bar is two lines on a narrow screen, and a hardcoded 44px offset left
     a gap there through which the page showed. */
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const publish = () => {
      document.documentElement.style.setProperty(
        "--sp-announce-h",
        `${Math.round(bar.getBoundingClientRect().height)}px`,
      );
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(bar);
    return () => observer.disconnect();
  }, [cycling]);

  useEffect(() => {
    const on = document.documentElement.dataset.motion !== "off";
    setCycling(on);
    if (!on) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={barRef} className="sticky top-0 z-50 border-b-[3px] border-sp-bubblegum bg-sp-black">
      <div className="sp-announce-stripes">
        {/* min-h, not h: at 320px the longest message wraps to two lines and a
            fixed 44px box clipped it. */}
        <div className="flex min-h-11 items-center justify-center px-4 py-1.5 sm:px-6">
          {cycling ? (
            <p
              key={index}
              className="sp-disclosure text-balance text-center text-[13px] text-sp-paper sm:text-sm"
              aria-live="off"
            >
              {ANNOUNCEMENTS[index]}
            </p>
          ) : (
            <div
              tabIndex={0}
              role="group"
              aria-label="Store announcements"
              className="flex max-w-full items-center gap-3 overflow-x-auto"
            >
              {ANNOUNCEMENTS.map((message, i) => (
                <span key={message} className="sp-disclosure whitespace-nowrap text-sp-paper">
                  {i > 0 && <span aria-hidden="true" className="mr-3 text-sp-bubblegum">◆</span>}
                  {message}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
