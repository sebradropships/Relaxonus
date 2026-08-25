import { FAQS, FAQ_HEADING } from "@/lib/product";

/**
 * Native <details>/<summary>: works with JavaScript off and is keyboard
 * accessible without any code. The marker rotates on the open transition only —
 * eight rows each spinning perpetually would be both a 2.2.2 problem and a
 * misuse of the universal loading convention as an idle state.
 */
export function Faq() {
  return (
    <section id="faq" className="sp-section">
      <div className="sp-shell max-w-[820px]">
        <h2 className="text-[length:var(--text-display-l)] text-sp-paper">{FAQ_HEADING}</h2>

        <div className="mt-10 flex flex-col gap-3">
          {FAQS.map((faq, index) => (
            <details
              key={faq.q}
              open={index === 0}
              className="group border-[3px] border-sp-paper bg-sp-carbon"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
                <span className="sp-display text-[length:var(--text-display-s)] text-sp-paper">
                  {faq.q}
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl text-sp-chlorine transition-transform duration-200 group-open:rotate-90"
                >
                  ›
                </span>
              </summary>
              <p className="max-w-[60ch] px-6 pb-6 text-[17px] leading-relaxed text-sp-paper">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
