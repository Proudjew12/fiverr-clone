import { SvgIcon } from '@/components/svg/SvgIconBackupEran'

export const DEFAULT_LOCALE = {
  langLabel: 'English',
  currencyCode: 'USD',
}

export function Locale({
  languageLabel = DEFAULT_LOCALE.langLabel,
  currencyLabel = DEFAULT_LOCALE.currencyCode,
  onLanguageClick,
}) {
  function handleLanguageClick(ev) {
    ev.preventDefault()
    if (onLanguageClick) onLanguageClick(ev)
  }

  return (
    <>
      <button
        type="button"
        className="footer-lang-btn grid items-center"
        onClick={handleLanguageClick}
      >
        <span className="globe" aria-hidden="true">
          <SvgIcon icon="footerGlobe" />
        </span>
        {languageLabel}
      </button>

      <span className="footer-currency">{currencyLabel}</span>
    </>
  )
}
