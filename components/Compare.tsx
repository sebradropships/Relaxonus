import {
  COMPARE_COLUMNS,
  COMPARE_FOOTNOTE,
  COMPARE_HEADING,
  COMPARE_ROWS,
  type Mark,
} from "@/lib/product";

/**
 * Tick versus cross is carried by three redundant signals before colour:
 * glyph shape, a permanently visible uppercase word, and an sr-only sentence.
 * Colour is the fourth carrier and reinforces only.
 */
function Cell({
  mark,
  value,
  column,
  highlight = false,
}: {
  mark: Mark;
  value: string;
  column: string;
  highlight?: boolean;
}) {
  const spoken = mark === "yes" ? "yes" : mark === "no" ? "no" : "varies";

  return (
    <td
      className={`border-t-2 border-sp-rule px-4 py-4 align-middle ${
        highlight ? "border-l-[3px] border-l-sp-chlorine bg-sp-chlorine/5" : ""
      }`}
    >
      <span className="sr-only">{`${column}: ${spoken}. ${value}.`}</span>
      <span aria-hidden="true" className="flex items-center gap-2">
        {mark === "yes" && <span className="text-lg font-black text-sp-go">✓</span>}
        {mark === "no" && (
          /* Outlined ring, never a filled red square. */
          <span className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-sp-paper text-sm font-black text-sp-no">
            ✗
          </span>
        )}
        {mark === "varies" && <span className="text-lg font-black text-sp-mist">—</span>}
        <span className="sp-display text-[13px] text-sp-paper">{value}</span>
      </span>
    </td>
  );
}

export function Compare() {
  return (
    <section id="compare" className="sp-section">
      <div className="sp-shell">
        <h2 className="text-[length:var(--text-display-l)] text-sp-paper">{COMPARE_HEADING}</h2>

        <div
          /* `relative` here is containment, not styling — do not drop it.
             Every `sr-only` span in the cells below is `position: absolute`
             with no insets, and an absolutely positioned box contributes its
             scrollable overflow to its CONTAINING BLOCK, not to its parent.
             With nothing positioned between those spans and <html>, that
             containing block was the initial one — the viewport — so their
             static positions inside this 760px-wide table (out to x≈627)
             became document-level scrollable overflow that no `overflow`
             rule on the page could reach, including `overflow-x: clip` on
             <body>, since `clip` establishes no containing block. Chromium
             declines to scroll it; iOS WebKit hands it over as ~240px of real
             sideways travel on a phone-width screen. Positioning this box
             makes it their containing block, so this scroller absorbs them. */
          className="relative mt-10 overflow-x-auto border-[3px] border-sp-paper"
          tabIndex={0}
          role="group"
          aria-label="Comparison table, scrollable"
        >
          <table className="w-full min-w-[760px] border-collapse bg-sp-carbon text-left">
            <thead>
              <tr>
                <th scope="col" className="sp-mono px-4 py-4 text-[13px] font-normal text-sp-mist">
                  <span className="sr-only">Attribute</span>
                </th>
                {/* Ours is highlighted. Columns 2 and 3 stay neutral — a red
                    competitor header is disparaging styling, not information. */}
                <th
                  scope="col"
                  className="sp-display border-l-[3px] border-sp-chlorine bg-sp-go px-4 py-4 text-sm text-sp-ink"
                >
                  {COMPARE_COLUMNS[0]}
                </th>
                <th scope="col" className="sp-display px-4 py-4 text-sm text-sp-paper">
                  {COMPARE_COLUMNS[1]}
                </th>
                <th scope="col" className="sp-display px-4 py-4 text-sm text-sp-paper">
                  {COMPARE_COLUMNS[2]}
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.attribute}>
                  <th
                    scope="row"
                    className="border-t-2 border-sp-rule px-4 py-4 text-[15px] font-medium text-sp-paper"
                  >
                    {row.attribute}
                  </th>
                  <Cell {...row.ours} column={COMPARE_COLUMNS[0]} highlight />
                  <Cell {...row.powered} column={COMPARE_COLUMNS[1]} />
                  <Cell {...row.hands} column={COMPARE_COLUMNS[2]} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="sp-disclosure mt-5 max-w-[70ch] text-sp-mist">{COMPARE_FOOTNOTE}</p>
      </div>
    </section>
  );
}
