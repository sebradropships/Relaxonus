"use client";

import { useCallback, useEffect, useState } from "react";

import { useProduct } from "@/components/ProductProvider";
import { POPUP } from "@/lib/campaign";

function seenRecently(): boolean {
  try {
    const raw = window.localStorage.getItem(POPUP.storageKey);
    if (!raw) return false;
    const when = Number(raw);
    if (!Number.isFinite(when)) return false;
    return Date.now() - when < POPUP.rememberDays * 86_400_000;
  } catch {
    /* Private mode: treat as unseen rather than throwing. */
    return false;
  }
}

function remember() {
  try {
    window.localStorage.setItem(POPUP.storageKey, String(Date.now()));
  } catch {
    /* Nothing to do — it simply shows again next visit. */
  }
}

/**
 * Offer popup.
 *
 * Trigger is configurable — pointer leaving the viewport, a delay, or scroll
 * depth. Exit intent has no touch equivalent, so on a device without a fine
 * pointer it falls back to the delay rather than never firing.
 *
 * It never opens over the cart or on top of a checkout in progress: a popup
 * that interrupts someone mid-purchase costs more than it earns. Dismissal is
 * remembered for POPUP.rememberDays, and adding to the cart counts as a
 * dismissal, so a buyer is not asked twice.
 */
export function Popup() {
  const { cartOpen, cart, selectVariant, openCart } = useProduct();
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    remember();
  }, []);

  /* Arm only once the visitor has neither seen it recently nor already bought. */
  useEffect(() => {
    if (!POPUP.enabled) return;
    if (seenRecently()) return;
    setArmed(true);
  }, []);

  /* Someone with something in the cart is converting; do not interrupt. */
  useEffect(() => {
    if (cart > 0) {
      setArmed(false);
      setOpen(false);
    }
  }, [cart]);

  useEffect(() => {
    if (!armed) return;

    const fire = () => {
      /* Re-checked at fire time, not just at arm time: the cart may have
         filled, or the drawer opened, since this was scheduled. */
      if (document.body.style.overflow === "hidden") return;
      setOpen(true);
      setArmed(false);
    };

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const trigger = POPUP.trigger === "exit" && !finePointer ? "delay" : POPUP.trigger;

    if (trigger === "exit") {
      const onLeave = (event: MouseEvent) => {
        if (event.clientY <= 0) fire();
      };
      document.addEventListener("mouseout", onLeave);
      return () => document.removeEventListener("mouseout", onLeave);
    }

    if (trigger === "delay") {
      const id = setTimeout(fire, POPUP.delaySeconds * 1000);
      return () => clearTimeout(id);
    }

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      if ((window.scrollY / max) * 100 >= POPUP.scrollPercent) fire();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [armed]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open || cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[75] grid place-items-center p-4">
      <button
        type="button"
        aria-label="Close offer"
        onClick={close}
        className="fade absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-heading"
        className="rise card relative w-full max-w-sm p-6 text-center sm:p-7"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close offer"
          className="tap absolute right-1 top-1 grid w-11 place-items-center text-xl leading-none text-muted transition-colors hover:text-ink"
        >
          <span aria-hidden="true">✕</span>
        </button>

        <h2 id="popup-heading" className="display mt-2 text-2xl text-ink">
          {POPUP.heading}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{POPUP.body}</p>

        <button
          type="button"
          onClick={() => {
            selectVariant("set");
            close();
            document.getElementById("buy")?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          className="btn btn-primary tap-lg mt-5 w-full px-6 py-3.5 text-[15px]"
        >
          {POPUP.cta}
        </button>

        <button
          type="button"
          onClick={close}
          className="tap mt-1 w-full text-[13px] text-muted underline underline-offset-4 hover:text-ink"
        >
          {POPUP.dismiss}
        </button>
      </div>
    </div>
  );
}
