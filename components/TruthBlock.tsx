import { TRUTH_BODY, TRUTH_CHIPS, TRUTH_HEADING, TRUTH_PAYOFF } from "@/lib/product";

export function TruthBlock() {
  return (
    <section className="border-t-[3px] border-sp-no py-24">
      <div className="sp-shell text-center">
        <h2 className="text-[length:var(--text-display-l)] text-sp-paper">{TRUTH_HEADING}</h2>

        <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
          {TRUTH_CHIPS.map((chip) => (
            <li
              key={chip}
              /* Outlined, never a solid red block — a red fill reads as a sale colour. */
              className="sp-display rounded-full border-[3px] border-sp-no px-4 py-2 text-sm text-sp-paper"
            >
              <span aria-hidden="true">🚫 </span>
              {chip}
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-10 max-w-[60ch] text-left text-xl leading-relaxed text-sp-paper">
          {TRUTH_BODY}
        </p>

        <p
          className="sp-display mx-auto mt-12 max-w-3xl border-[3px] border-sp-black bg-sp-chlorine px-6 py-6 text-lg text-sp-ink"
          style={{ rotate: "-1.5deg" }}
        >
          {TRUTH_PAYOFF}
        </p>
      </div>
    </section>
  );
}
