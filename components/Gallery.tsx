"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { useProduct } from "@/components/ProductProvider";
import { SaleSticker } from "@/components/SaleSticker";
import { VARIANTS } from "@/lib/product";

/**
 * Swipeable on mobile, thumbnail-driven on desktop — one scroller, not two
 * components. Scroll-snap does the paging on touch; the thumbnails below
 * scroll it programmatically.
 *
 * `.xscroll` carries `position: relative`, which is load-bearing: without it
 * any absolutely positioned descendant would resolve against the initial
 * containing block and leak the scroller's full width into the document's
 * horizontal overflow.
 */
export function Gallery() {
  const { variant, image, selectImage } = useProduct();
  const option = VARIANTS[variant];
  const trackRef = useRef<HTMLDivElement | null>(null);
  /* Guards the observer while a click-driven scroll is still settling, so the
     midpoint of the animation cannot overwrite the index the user just chose. */
  const seeking = useRef(false);

  /* Keep the scroller in step when the tier changes or a thumb is clicked. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[image] as HTMLElement | undefined;
    if (!child) return;

    /* Measured, not `offsetLeft`: the children's offsetParent is the track
       itself, so subtracting the track's own offsetLeft would double-count the
       shell padding and land the wrong slide under the snap point. */
    const delta = child.getBoundingClientRect().left - track.getBoundingClientRect().left;
    if (Math.abs(delta) < 1) return;

    seeking.current = true;
    track.scrollTo({ left: track.scrollLeft + delta, behavior: "smooth" });
    const done = setTimeout(() => {
      seeking.current = false;
    }, 400);
    return () => clearTimeout(done);
  }, [image, variant]);

  /* Report the slide the user swiped to, so the thumbnails stay truthful. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (seeking.current) return;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) selectImage(index);
        }
      },
      { root: track, threshold: 0.6 },
    );

    for (const child of Array.from(track.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [selectImage, variant]);

  return (
    <div>
      {/* Wrapper, not the scroller: the sticker must sit still over the gallery
          rather than slide away with the first slide. */}
      <div className="relative">
        <SaleSticker />
        <div
          ref={trackRef}
          className="xscroll flex snap-x snap-mandatory rounded-2xl border border-line bg-surface"
          aria-label={`${option.name} product images`}
        >
          {option.frames.map((frame, index) => (
            <div
              key={frame.url}
              data-index={index}
              className="relative aspect-square w-full shrink-0 snap-center"
            >
              <Image
                src={frame.url}
                alt={frame.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 1023px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots: the swipe affordance on mobile, where thumbnails are hidden. */}
      <div className="mt-3 flex justify-center gap-1.5 sm:hidden" aria-hidden="true">
        {option.frames.map((frame, index) => (
          <span
            key={frame.url}
            className={`h-1.5 rounded-full transition-all ${
              index === image ? "w-5 bg-accent" : "w-1.5 bg-line-strong"
            }`}
          />
        ))}
      </div>

      <div className="mt-3 hidden grid-cols-5 gap-2 sm:grid">
        {option.frames.map((frame, index) => {
          const active = index === image;
          return (
            <button
              key={frame.url}
              type="button"
              onClick={() => selectImage(index)}
              aria-label={`View image ${index + 1}: ${frame.alt}`}
              aria-pressed={active}
              className={`relative aspect-square overflow-hidden rounded-lg border bg-surface transition-colors ${
                active ? "border-accent ring-1 ring-accent" : "border-line hover:border-line-strong"
              }`}
            >
              <Image src={frame.url} alt="" fill sizes="110px" className="object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
