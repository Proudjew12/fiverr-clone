export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        {/* LEFT SIDE */}
        <div className="footer-left">
          <div className="footer-brand">
            <span className="footer-logo">Leo.</span>
            <span className="footer-copy">© 2026 Fiverr Clone</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="footer-right">
          {/* SOCIAL ICONS */}
          <div className="footer-social">
            <a className="footer-icon-btn" href="#" aria-label="LinkedIn">
              <img src="/assets/FooterIcons/2[F].svg" alt="" draggable="false" />
            </a>

            <a className="footer-icon-btn" href="#" aria-label="GitHub">
              <img src="/assets/FooterIcons/4[F].svg" alt="" draggable="false" />
            </a>
          </div>

          {/* DOT */}
          <span className="footer-divider" aria-hidden="true" />

          {/* LANGUAGE */}
          <button type="button" className="footer-lang-btn">
            <span className="globe" aria-hidden="true">
              <img src="/assets/FooterIcons/1[F].svg" alt="" draggable="false" />
            </span>
            English
          </button>

          {/* CURRENCY */}
          <span className="footer-currency">€ EUR</span>

          {/* ACCESSIBILITY */}
          <button
            type="button"
            className="footer-icon-btn footer-accessibility"
            aria-label="Accessibility"
          >
            <img src="/assets/FooterIcons/3[F].svg" alt="" draggable="false" />
          </button>
        </div>
      </div>
    </footer>
  )
}
