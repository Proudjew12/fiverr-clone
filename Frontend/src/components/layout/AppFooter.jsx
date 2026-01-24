import { DEFAULT_LOCALE } from '@/components/ui/Locale'
import { SvgIcon, FOOTER_SOCIAL_LINKS } from '@/components/svg/SvgIcon'
import { LeoChange } from '@/components/headerComponents/LeoChange'

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="footer-inner grid items-center">
        <FooterBrand />
        <FooterActions />
      </div>
    </footer>
  )
}

/* =========================
   Brand
   ========================= */

function FooterBrand() {
  return (
    <div className="footer-left grid">
      <div className="footer-brand grid items-center">
        <span className="footer-logo">
          Leo<span className="logo-dot">.</span>
        </span>

        <span className="footer-copy">© 2026 Leo Service Rights</span>
      </div>
    </div>
  )
}

/* =========================
   Actions
   ========================= */

function FooterActions() {
  return (
    <div className="footer-right grid items-center">
      <FooterSocial />

      <span className="footer-divider" aria-hidden="true" />

      <LeoChange
        initialLang={DEFAULT_LOCALE.langLabel}
        initialCurrency={DEFAULT_LOCALE.currencyCode}
      >
        <button type="button" className="footer-lang-btn grid items-center">
          <span className="globe" aria-hidden="true">
            <SvgIcon icon="footerGlobe" />
          </span>
          {DEFAULT_LOCALE.langLabel}
          <span className="footer-currency">{DEFAULT_LOCALE.currencyCode}</span>
        </button>
      </LeoChange>

      <FooterAccessibility />
    </div>
  )
}

/* =========================
   Social
   ========================= */

function FooterSocial() {
  function onSocialClick(ev) {
    ev.preventDefault()
  }

  return (
    <div className="footer-social grid items-center" aria-label="Footer social links">
      {FOOTER_SOCIAL_LINKS.map((link) => (
        <a
          key={link.key}
          className="footer-icon-btn grid place-center"
          href={link.href}
          aria-label={link.label}
          onClick={link.href === '#' ? onSocialClick : undefined}
          target={link.isExternal ? '_blank' : undefined}
          rel={link.isExternal ? 'noreferrer' : undefined}
        >
          <SvgIcon icon={link.icon} />
        </a>
      ))}
    </div>
  )
}

/* =========================
   Accessibility
   ========================= */

function FooterAccessibility() {
  return (
    <button
      type="button"
      className="footer-icon-btn footer-accessibility grid place-center"
      aria-label="Accessibility"
    >
      <SvgIcon icon="footerAccessibility" />
    </button>
  )
}
