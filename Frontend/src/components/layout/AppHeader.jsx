import { Link } from 'react-router-dom'

import { LeoProDd } from '@/components/headerComponents/ProDd'
import { LeoChange } from '@/components/headerComponents/LeoChange'
import { ExploreDd } from '@/components/headerComponents/ExploreDd'
import { SearchInput } from '@/components/headerComponents/SearchInput'
import { SvgIcon } from '@/components/svg/SvgIconBackupEran'
import { useDropdown } from '@/hooks/useDropdown'

const DEFAULT_LOCALE = {
  langLabel: 'English',
  currencyCode: 'USD',
}

export function AppHeader() {
  const { openDd, toggleDd, closeDd, rootRef } = useDropdown()

  return (
    <header ref={rootRef} className="app-header">
      <div className="app-header-row">
        <div className="app-header-inner flex items-center justify-between">
          <HeaderLeft />
          <HeaderRight openDd={openDd} onToggleDd={toggleDd} onCloseDd={closeDd} />
        </div>
      </div>
    </header>
  )
}

/* =========================
   Left side
   ========================= */

function HeaderLeft() {
  return (
    <div className="header-left flex items-center">
      <Logo />

      <div className="header-search">
        <SearchInput />
      </div>
    </div>
  )
}

function Logo() {
  return (
    <Link to="/" className="logo-header" aria-label="Go to homepage">
      <span className="site-logo-text">Leo</span>
    </Link>
  )
}

/* =========================
   Right side
   ========================= */

function HeaderRight({ openDd, onToggleDd, onCloseDd }) {
  return (
    <nav className="header-nav flex items-center" aria-label="Header">
      <div className="nav-group nav-group-links flex items-center">
        <HeaderDropdowns openDd={openDd} onToggleDd={onToggleDd} onCloseDd={onCloseDd} />

        <LanguageCurrencyButton
          langLabel={DEFAULT_LOCALE.langLabel}
          currencyCode={DEFAULT_LOCALE.currencyCode}
        />

        <HeaderActions />
      </div>

      <JoinButton />
    </nav>
  )
}

function HeaderDropdowns({ openDd, onToggleDd, onCloseDd }) {
  return (
    <div className="nav-group nav-group-dd flex items-center">
      <ProDropdown
        isOpen={openDd === 'pro'}
        onToggle={() => onToggleDd('pro')}
        onClose={onCloseDd}
      />

      <ExploreDd
        isOpen={openDd === 'explore'}
        onToggle={() => onToggleDd('explore')}
        onClose={onCloseDd}
      />
    </div>
  )
}

function HeaderActions() {
  return (
    <>
      <button type="button" className="header-link header-link-green">
        Become a Seller
      </button>

      <button type="button" className="header-link header-link-green">
        Sign in
      </button>
    </>
  )
}

function JoinButton() {
  return (
    <button type="button" className="join-btn grid place-center">
      Join
    </button>
  )
}

/* =========================
   Small controls
   ========================= */

function LanguageCurrencyButton({ langLabel, currencyCode }) {
  return (
    <LeoChange initialLang={langLabel} initialCurrency={currencyCode}>
      <button type="button" className="header-link header-link-green">
        <span className="globe grid place-center" aria-hidden="true">
          <SvgIcon icon="headerGlobe" />
        </span>
        {langLabel}
      </button>
    </LeoChange>
  )
}

function ProDropdown({ isOpen, onToggle, onClose }) {
  return (
    <div className="nav-dd">
      <button
        type="button"
        className="nav-dd-trigger"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={onToggle}
      >
        Leo Pro
        <span className={`nav-arrow-down ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
          <SvgIcon icon="chevronDown" />
        </span>
      </button>

      {isOpen && (
        <div className="nav-dd-panel nav-dd-panel-pro" aria-label="Leo Pro">
          <LeoProDd onClose={onClose} />
        </div>
      )}
    </div>
  )
}
