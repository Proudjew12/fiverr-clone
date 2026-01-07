import { LogoHeader } from '@/components/svg/LogoHeader'
import { FiverrProHeader } from '@/components/headerCmps/FiverrProHeader'
import { FiverrChange } from '@/components/headerCmps/FiverrChange'
import { ExploreDd } from '@/components/headerCmps/ExploreDd'
import { useDropdown } from '@/hooks/useDropdown'

export function AppHeader() {
  const { openDd, toggleDd, rootRef } = useDropdown()

  return (
    <header ref={rootRef} className="app-header">
      <div className="app-header-row">
        <div className="app-header-inner grid align-center">
          <LogoHeader />

          <nav className="header-nav grid align-center" aria-label="Header">
            <div className="nav-group nav-group-dd grid align-center">
              <ProDd isOpen={openDd === 'pro'} onToggle={() => toggleDd('pro')} />
              <ExploreDd
                isOpen={openDd === 'explore'}
                onToggle={() => toggleDd('explore')}
              />
            </div>

            <div className="nav-group nav-group-links grid align-center">
              <FiverrChange initialLang="English" initialCurrency="USD">
                <button type="button" className="header-link header-link-green">
                  <span className="globe" aria-hidden="true">
                    <img
                      className="globe-icon"
                      src="/assets/HeaderIcons/3[H].svg"
                      alt=""
                      width="16"
                      height="16"
                      draggable="false"
                    />
                  </span>
                  English
                </button>
              </FiverrChange>

              <a className="header-link header-link-green" href="#">
                Become a Seller
              </a>

              <a className="header-link header-link-green" href="#">
                Sign in
              </a>
            </div>

            <a className="join-btn" href="#">
              Join
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

function ProDd({ isOpen, onToggle }) {
  return (
    <div className="nav-dd">
      <button
        type="button"
        className="nav-dd-trigger"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={onToggle}
      >
        Leo Pro
        <span className={`nav-arrow-down ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {isOpen && (
        <div
          className="nav-dd-panel nav-dd-panel-pro"
          role="menu"
          aria-label="Fiverr Pro"
        >
          <FiverrProHeader />
        </div>
      )}
    </div>
  )
}
