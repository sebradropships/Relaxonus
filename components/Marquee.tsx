"use client";

/**
 * Full-bleed scrolling spec band.
 *
 * The track is duplicated so the loop is seamless; the duplicate is hidden from
 * assistive technology so the chain is announced exactly once. With motion off
 * the strip becomes a focusable horizontal scroller — a scroll container with
 * no focusable child is otherwise unreachable by keyboard.
 */
export function Marquee({
  items,
  tone,
  direction,
  tilt = false,
}: {
  items: string[];
  tone: "pink" | "deep";
  direction: "left" | "right";
  tilt?: boolean;
}) {
  const ground = tone === "pink" ? "bg-sp-bubblegum" : "bg-sp-deep";
  const ink = tone === "pink" ? "text-sp-ink" : "text-sp-paper";
  const anim = direction === "left" ? "sp-ticker-a" : "sp-ticker-b";

  const Track = ({ duplicate }: { duplicate: boolean }) => (
    <div
      className={`sp-ticker-dupe-wrap flex shrink-0 items-center gap-8 pr-8 ${
        duplicate ? "sp-ticker-dupe" : ""
      }`}
      aria-hidden={duplicate || undefined}
    >
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex shrink-0 items-center gap-8">
          <span className="sp-display sp-num text-[length:var(--text-marquee)] whitespace-nowrap">
            {item}
          </span>
          <span aria-hidden="true" className="block size-3 rotate-45 bg-current opacity-70" />
        </span>
      ))}
    </div>
  );

  return (
    /*
      Two nested clips, and both are load-bearing.

      The tilted band is deliberately ~6% wider than the viewport so its
      rotated corners still cover the full width, and with motion off the
      track below becomes a real `overflow-x: auto` scroller. That is an
      overwide, independently scrollable box sitting inside a rotated parent —
      the exact shape WebKit fails to clip with `overflow: hidden` alone,
      handing the page genuine sideways travel. Chromium clips it either way,
      which is why no Chromium-based check ever reproduced it.

      `contain: paint` is the guarantee `overflow: hidden` is not: it is a
      hard promise that nothing paints outside this box, and it survives the
      rotate, the scale and the composited descendant.
    */
    <div className="overflow-hidden [contain:paint]">
      <div
        className={`${ground} ${ink} border-y-[3px] border-sp-black overflow-hidden isolate [contain:paint]`}
        style={tilt ? { rotate: "-2deg", scale: "1.06" } : undefined}
      >
        <div
          className="sp-ticker-track flex py-4"
          tabIndex={0}
          role="group"
          aria-label="Product specifications"
        >
          <div className={`${anim} flex min-w-max`}>
            <Track duplicate={false} />
            <Track duplicate />
          </div>
        </div>
      </div>
    </div>
  );
}
