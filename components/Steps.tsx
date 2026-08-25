import { STEPS, STEPS_HEADING, STEPS_KICKER } from "@/lib/product";

/** The light break in an otherwise black page. */
export function Steps() {
  return (
    <section id="how" className="border-y-[3px] border-sp-black bg-sp-steam py-24">
      <div className="sp-shell relative">
        <h2 className="text-center text-[length:var(--text-display-l)] text-sp-black">
          {STEPS_HEADING}
        </h2>

        <ol className="mt-14 grid gap-10 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.num} className="relative text-center md:text-left">
              <span
                aria-hidden="true"
                className="sp-display sp-num block text-[120px] leading-none text-sp-deep"
              >
                {step.num}
              </span>
              <h3 className="mt-2 text-[length:var(--text-display-m)] text-sp-black">
                <span className="sr-only">Step {step.num}: </span>
                {step.verb}
              </h3>
              <p className="mt-2 text-lg text-sp-black">{step.body}</p>

              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-5 top-14 hidden text-4xl text-sp-black md:block"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>

        <p className="mx-auto mt-14 max-w-[60ch] text-center text-lg text-sp-black">
          {STEPS_KICKER}
        </p>
      </div>
    </section>
  );
}
