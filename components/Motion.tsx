"use client";

import { useEffect, useState } from "react";

/**
 * The WCAG 2.2.2 mechanism for every infinite animation on the page.
 *
 * `prefers-reduced-motion` is not a 2.2.2 mechanism on its own: most
 * motion-sensitive people have never set the OS flag, hover does not exist on
 * touch, and `focus-within` never fires inside a marquee that contains nothing
 * focusable. So a visible, persistent toggle ships instead — twice, in the
 * header and the footer, both writing the same attribute.
 */

const KEY = "sp-motion";

/** Runs before paint so the page never starts animating and then stops. */
export const MOTION_BOOTSTRAP = `(function(){try{
var s=localStorage.getItem("${KEY}");
var r=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.dataset.motion=s||(r?"off":"on");
}catch(e){document.documentElement.dataset.motion="on";}})();`;

export function MotionToggle({ className = "" }: { className?: string }) {
  const [motion, setMotion] = useState<"on" | "off" | null>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.motion;
    setMotion(current === "off" ? "off" : "on");
  }, []);

  function toggle() {
    const next = motion === "off" ? "on" : "off";
    document.documentElement.dataset.motion = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* Private mode: the attribute still applies for this page view. */
    }
    setMotion(next);
  }

  // Render nothing until the client knows the real state, so the label can
  // never contradict what the page is actually doing.
  if (motion === null) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className={`sp-tap items-center justify-center sp-mono sp-squeeze whitespace-nowrap border-2 border-sp-mist px-3 text-xs text-sp-mist transition-colors hover:border-sp-chlorine hover:text-sp-chlorine ${className}`}
      aria-label={motion === "off" ? "Turn page animation on" : "Turn page animation off"}
    >
      MOTION {motion === "off" ? "OFF" : "ON"}
    </button>
  );
}
