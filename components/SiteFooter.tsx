import { MotionToggle } from "@/components/Motion";
import { FOOTER } from "@/lib/product";

function ApplePayMark() {
  return (
    <span
      className="sp-display grid h-6 min-w-[52px] place-items-center border-2 border-sp-mist px-2 text-[10px] text-sp-mist"
      role="img"
      aria-label="Apple Pay accepted"
    >
      APPLE PAY
    </span>
  );
}

function GooglePayMark() {
  return (
    <span
      className="sp-display grid h-6 min-w-[52px] place-items-center border-2 border-sp-mist px-2 text-[10px] text-sp-mist"
      role="img"
      aria-label="Google Pay accepted"
    >
      G PAY
    </span>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t-[3px] border-sp-deep bg-sp-black">
      <div className="sp-shell py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="sp-display text-2xl text-sp-paper">RELAXONUS</p>
            <p className="mt-2 text-[15px] text-sp-mist">{FOOTER.tagline}</p>
          </div>

          {FOOTER.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="sp-mono text-[13px] text-sp-mist">{column.title}</p>
              <ul className="mt-4 flex flex-col gap-1">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="flex min-h-11 items-center text-[15px] text-sp-mist transition-colors hover:text-sp-chlorine"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <hr className="my-10 border-t-2 border-sp-rule" />

        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <ApplePayMark />
            <GooglePayMark />
          </div>
          <MotionToggle />
        </div>

        {/* `treat` and `cure` below are the whitelisted disclaimer strings.
            A literal banned-word grep will flag them — do not delete. */}
        <p className="sp-disclosure mt-8 max-w-[80ch] text-sp-mist">{FOOTER.legal}</p>
        <p className="sp-disclosure mt-4 text-sp-mist">{FOOTER.copyright}</p>
      </div>
    </footer>
  );
}
