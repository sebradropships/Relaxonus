"use client";

import { useEffect, useRef, useState } from "react";

import { DEMO_VIDEO } from "@/lib/product";

import styles from "./Demo.module.css";

/**
 * Demonstration video.
 *
 * Autoplays muted and looping, because the point of the clip is the squeeze
 * motion and a still cannot carry it. Anyone who has asked their system for
 * reduced motion gets a paused poster frame and the controls instead — the
 * video never starts itself for them.
 */
export function Demo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const allowed = !query.matches;
      setMotionOk(allowed);

      const video = videoRef.current;
      if (!video) return;

      if (allowed) {
        // Autoplay can still be refused (low power mode, data saver). That is
        // fine — the poster and controls remain.
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    };

    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <section className="shell section" id="demo">
      <div className={styles.wrap}>
        <div className={styles.copy}>
          <h2 className="h2">{DEMO_VIDEO.heading}</h2>
          <p className="lede">{DEMO_VIDEO.body}</p>
          <p className={styles.caption}>{DEMO_VIDEO.caption}</p>
        </div>

        <div className={styles.player}>
          <video
            ref={videoRef}
            className={styles.video}
            src={DEMO_VIDEO.src}
            poster={DEMO_VIDEO.poster}
            width={DEMO_VIDEO.width}
            height={DEMO_VIDEO.height}
            preload="metadata"
            muted
            loop={motionOk}
            playsInline
            controls
            aria-label="Demonstration of the Relaxonus neck massager being used"
          />
        </div>
      </div>
    </section>
  );
}
