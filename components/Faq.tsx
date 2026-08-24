"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FAQS } from "@/lib/product";

import styles from "./Marketing.module.css";

const ALL_CLOSED = -1;

export function Faq() {
  const [open, setOpen] = useState(0);
  const [ready, setReady] = useState(false);

  const panels = useRef<Array<HTMLDivElement | null>>([]);

  /* Heights are measured rather than hard-coded, so an answer of any length
     opens fully instead of being clipped. */
  const sync = useCallback(() => {
    panels.current.forEach((panel, index) => {
      if (!panel) return;
      panel.style.maxHeight = index === open ? `${panel.scrollHeight}px` : "0px";
    });
  }, [open]);

  useEffect(() => {
    sync();
    setReady(true);
  }, [sync]);

  useEffect(() => {
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  /* Web fonts land after first paint and change how the answers wrap. */
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) sync();
    });
    return () => {
      cancelled = true;
    };
  }, [sync]);

  return (
    <section className={`shell shell-narrow ${styles.faqSection}`} id="faq">
      <h2 className="h2 h2-stacked">FAQ</h2>

      <div className={styles.faqList} data-ready={ready}>
        {FAQS.map((faq, index) => {
          const isOpen = index === open;

          return (
            <div key={faq.q} className={styles.faqItem}>
              <h3 className={styles.faqHeading}>
                <button
                  type="button"
                  id={`faq-q-${index}`}
                  className={styles.faqQuestion}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${index}`}
                  onClick={() => setOpen(isOpen ? ALL_CLOSED : index)}
                >
                  <span>{faq.q}</span>
                  <span
                    className={`${styles.faqSign} ${isOpen ? styles.faqSignOpen : ""}`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
              </h3>

              <div
                id={`faq-a-${index}`}
                role="region"
                aria-labelledby={`faq-q-${index}`}
                ref={(node) => {
                  panels.current[index] = node;
                }}
                className={`${styles.faqAnswer} ${isOpen ? styles.faqAnswerOpen : ""}`}
              >
                <p>{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
