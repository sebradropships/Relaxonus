import { RECEIPTS } from "@/lib/product";

/**
 * Occupies the slot a reviews carousel would.
 *
 * The store has zero orders, so there is nothing honest to put in a review
 * component — and leaving one in the tree invites fake content back into it.
 * The absence is disclosed once, at body size, under a heading about what the
 * visitor CAN verify. It is not a display-size apology.
 */
export function Receipts() {
  return (
    <section id="receipts" className="border-y-[3px] border-sp-black bg-sp-blush py-24">
      <div className="sp-shell">
        <p className="sp-mono text-[13px] text-sp-black">{RECEIPTS.eyebrow}</p>
        <h2 className="mt-3 text-[length:var(--text-display-l)] text-sp-black">
          {RECEIPTS.heading}
        </h2>
        <p className="mt-5 max-w-[60ch] text-xl text-sp-black">{RECEIPTS.line}</p>

        {/* Occupies the exact visual slot a "12,483 happy customers" counter
            would, with figures that are actually checkable. */}
        <dl className="mt-12 grid grid-cols-2 gap-6 border-y-[3px] border-sp-black py-8 md:grid-cols-5">
          {RECEIPTS.specs.map((spec) => (
            <div key={spec.label}>
              <dt className="sr-only">{spec.label}</dt>
              <dd>
                <span className="sp-mono sp-num block text-3xl text-sp-black sm:text-4xl">
                  {spec.value}
                </span>
                <span className="sp-mono mt-2 block text-xs leading-tight text-sp-black">
                  {spec.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {RECEIPTS.tiles.map((tile) => (
            <div
              key={tile.title}
              className="border-[3px] border-sp-black bg-sp-black p-6 sp-hard-ink"
            >
              <h3 className="text-[length:var(--text-display-s)] text-sp-paper">{tile.title}</h3>
              <p className="mt-3 text-[15px] leading-snug text-sp-paper">{tile.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-lg text-sp-black">{RECEIPTS.closing}</p>
      </div>
    </section>
  );
}
