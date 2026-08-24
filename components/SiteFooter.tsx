import { FOOTER_LINKS } from "@/lib/product";

import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <span className="brand brand-sm">RELAXONUS</span>

        <nav className={styles.nav} aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <span className={styles.copyright}>© 2026 Relaxonus</span>
      </div>
    </footer>
  );
}
