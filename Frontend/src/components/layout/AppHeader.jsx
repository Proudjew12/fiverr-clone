import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { utilService } from '@/services/util.service'

import { LeoProDd } from '@/components/headerComponents/ProDd'
import { LeoChange } from '@/components/headerComponents/LeoChange'
import { ExploreDd } from '@/components/headerComponents/ExploreDd'
import { SearchInput } from '@/components/headerComponents/SearchInput'
import { SvgIcon } from '@/components/svg/SvgIconBackupEran'
import { useDropdown } from '@/hooks/useDropdown'
import { useHeaderSearchObserver } from '@/hooks/useHeaderSearchObserver'

const DEFAULT_LOCALE = {
  langLabel: 'English',
  currencyCode: 'USD',
}

export function AppHeader() {
  const { openDd, toggleDd, closeDd, rootRef, getOptionProps } = useDropdown()
  const showHeaderSearch = useHeaderSearchObserver()
  const [isSignedIn, setIsSignedIn] = useState(
    () => localStorage.getItem('isSignedIn') === 'true'
  )
  const [orders, setOrders] = useState(() => getOrdersFromStorage())
  const navigate = useNavigate()

  useEffect(() => {
    function updateOrders() {
      setOrders(getOrdersFromStorage())
    }

    window.addEventListener('storage', updateOrders)
    window.addEventListener('orders-updated', updateOrders)

    return () => {
      window.removeEventListener('storage', updateOrders)
      window.removeEventListener('orders-updated', updateOrders)
    }
  }, [])

  function handleSignIn() {
    setIsSignedIn(true)
    localStorage.setItem('isSignedIn', 'true')
    localStorage.setItem('userName', 'ProudJew')
    closeDd()
    navigate('/index')
  }

  function handleSignOut() {
    setIsSignedIn(false)
    localStorage.removeItem('isSignedIn')
    localStorage.removeItem('userName')
    closeDd()
    navigate('/')
  }

  return (
    <header ref={rootRef} className="app-header">
      <div className="app-header-row">
        <div className="app-header-inner flex items-center justify-between">
          <HeaderLeft showSearch={showHeaderSearch} />
          <HeaderRight
            openDd={openDd}
            onToggleDd={toggleDd}
            onCloseDd={closeDd}
            getOptionProps={getOptionProps}
            orders={orders}
            isSignedIn={isSignedIn}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
          />
        </div>
      </div>
    </header>
  )
}

/* =========================
   Left side
   ========================= */

function HeaderLeft({ showSearch }) {
  return (
    <div className="header-left flex items-center">
      <Logo />

      <div className={`header-search ${showSearch ? '' : 'is-hidden'}`}>
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

function HeaderRight({
  openDd,
  onToggleDd,
  onCloseDd,
  getOptionProps,
  orders,
  isSignedIn,
  onSignIn,
  onSignOut,
}) {
  return (
    <nav className="header-nav flex items-center" aria-label="Header">
      <div className="nav-group nav-group-links flex items-center">
        <HeaderDropdowns openDd={openDd} onToggleDd={onToggleDd} onCloseDd={onCloseDd} />

        <LanguageCurrencyButton
          langLabel={DEFAULT_LOCALE.langLabel}
          currencyCode={DEFAULT_LOCALE.currencyCode}
        />

        {isSignedIn ? (
          <SignedInActions
            openDd={openDd}
            onToggleDd={onToggleDd}
            onCloseDd={onCloseDd}
            getOptionProps={getOptionProps}
            orders={orders}
            onSignOut={onSignOut}
          />
        ) : (
          <HeaderActions onSignIn={onSignIn} />
        )}
      </div>

      {!isSignedIn && <JoinButton />}
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

function HeaderActions({ onSignIn }) {
  return (
    <>
      <button type="button" className="header-link header-link-green">
        Become a Seller
      </button>

      <button type="button" className="header-link header-link-green" onClick={onSignIn}>
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

function SignedInActions({
  openDd,
  onToggleDd,
  onCloseDd,
  getOptionProps,
  orders,
  onSignOut,
}) {
  return (
    <>
      <OrdersDropdown
        isOpen={openDd === 'orders'}
        onToggle={() => onToggleDd('orders')}
        orders={orders}
      />
      <UserDropdown
        isOpen={openDd === 'user'}
        onToggle={() => onToggleDd('user')}
        onClose={onCloseDd}
        getOptionProps={getOptionProps}
        onSignOut={onSignOut}
      />
    </>
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

function OrdersDropdown({ isOpen, onToggle, orders }) {
  const formatMoney = (value) => `₪${Number(value).toFixed(2)}`

  return (
    <div className="nav-dd">
      <button
        type="button"
        className="nav-dd-trigger"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={onToggle}
      >
        Orders
        <span className={`nav-arrow-down ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
          <SvgIcon icon="chevronDown" />
        </span>
      </button>

      {isOpen && (
        <div className="nav-dd-panel nav-dd-panel-orders" aria-label="Orders">
          {!orders.length && <div className="orders-dd-empty">No orders yet</div>}
          {!!orders.length && (
            <ul className="orders-dd-list">
              {orders.slice(0, 3).map((order) => (
                <li key={order.id} className="orders-dd-item">
                  <span className="orders-dd-title">{order.title}</span>
                  <span className="orders-dd-meta">{formatMoney(order.total)}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/dashboard" className="orders-dd-link">
            View all orders
          </Link>
        </div>
      )}
    </div>
  )
}

function getOrdersFromStorage() {
  return utilService.loadFromStorage('orders', [])
}

function UserDropdown({ isOpen, onToggle, onClose, getOptionProps, onSignOut }) {
  return (
    <div className="nav-dd nav-dd-user">
      <button
        type="button"
        className="user-avatar-btn"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="User menu"
        onClick={onToggle}
      >
        <span className="user-avatar-icon" aria-hidden="true">
          <SvgIcon icon="userCircle" />
        </span>
        <span className={`nav-arrow-down ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
          <SvgIcon icon="chevronDown" />
        </span>
      </button>

      {isOpen && (
        <div className="nav-dd-panel nav-dd-panel-user" aria-label="User menu" role="menu">
          <Link to="/dashboard" className="user-menu-item" onClick={onClose}>
            Dashboard
          </Link>
          <button type="button" className="user-menu-item" {...getOptionProps?.()}>
            Become a Seller
          </button>
          <button
            type="button"
            className="user-menu-item"
            onClick={onSignOut}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
