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
  const [wishlist, setWishlist] = useState(() => getWishlistFromStorage())
  const navigate = useNavigate()

  useEffect(() => {
    function updateOrders() {
      setOrders(getOrdersFromStorage())
    }
    function updateWishlist() {
      setWishlist(getWishlistFromStorage())
    }

    window.addEventListener('storage', updateOrders)
    window.addEventListener('orders-updated', updateOrders)
    window.addEventListener('wishlist-updated', updateWishlist)

    return () => {
      window.removeEventListener('storage', updateOrders)
      window.removeEventListener('orders-updated', updateOrders)
      window.removeEventListener('wishlist-updated', updateWishlist)
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
            wishlist={wishlist}
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
  wishlist,
  isSignedIn,
  onSignIn,
  onSignOut,
}) {
  return (
    <nav className="header-nav flex items-center" aria-label="Header">
      <div className="nav-group nav-group-links flex items-center">
        <HeaderDropdowns
          openDd={openDd}
          onToggleDd={onToggleDd}
          onCloseDd={onCloseDd}
          isSignedIn={isSignedIn}
        />

        {!isSignedIn && (
          <LanguageCurrencyButton
            langLabel={DEFAULT_LOCALE.langLabel}
            currencyCode={DEFAULT_LOCALE.currencyCode}
          />
        )}

        {isSignedIn ? (
          <SignedInActions
            openDd={openDd}
            onToggleDd={onToggleDd}
            onCloseDd={onCloseDd}
            getOptionProps={getOptionProps}
            orders={orders}
            wishlist={wishlist}
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

function HeaderDropdowns({ openDd, onToggleDd, onCloseDd, isSignedIn }) {
  return (
    <div className="nav-group nav-group-dd flex items-center">
      <ProDropdown
        isOpen={openDd === 'pro'}
        onToggle={() => onToggleDd('pro')}
        onClose={onCloseDd}
      />

      {!isSignedIn && (
        <ExploreDd
          isOpen={openDd === 'explore'}
          onToggle={() => onToggleDd('explore')}
          onClose={onCloseDd}
        />
      )}
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
  wishlist,
  onSignOut,
}) {
  return (
    <>
      <HeaderIconButtons />
      <WishlistDropdown
        isOpen={openDd === 'wishlist'}
        onToggle={() => onToggleDd('wishlist')}
        wishlist={wishlist}
      />
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
  const fallbackThumbs = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200&q=80',
  ]

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
              {orders.slice(0, 3).map((order) => {
                const thumbSrc =
                  order.previewImg || utilService.pickRandom(fallbackThumbs)
                return (
                  <li key={order.id} className="orders-dd-item">
                    <img className="orders-dd-thumb" src={thumbSrc} alt="" />
                    <div className="orders-dd-content">
                      <Link to={`/gig/${order.gigId}`} className="orders-dd-title">
                        {order.title}
                      </Link>
                    </div>
                  </li>
                )
              })}
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

function WishlistDropdown({ isOpen, onToggle, wishlist = [] }) {
  const fallbackThumbs = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200&q=80',
  ]

  return (
    <div className="nav-dd">
      <button
        type="button"
        className="nav-dd-trigger nav-dd-trigger--icon"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={onToggle}
      >
        <span className="header-icon">
          <SvgIcon icon="headerHeart" />
        </span>
      </button>

      {isOpen && (
        <div className="nav-dd-panel nav-dd-panel-orders" aria-label="Wishlist">
          {!wishlist.length && <div className="orders-dd-empty">No saved gigs</div>}
          {!!wishlist.length && (
            <ul className="orders-dd-list">
              {wishlist.slice(0, 3).map((item) => {
                const thumbSrc =
                  item.previewImg || utilService.pickRandom(fallbackThumbs)
                return (
                  <li key={item.id} className="orders-dd-item">
                    <img className="orders-dd-thumb" src={thumbSrc} alt="" />
                    <div className="orders-dd-content">
                      <Link to={`/gig/${item.gigId}`} className="orders-dd-title">
                        {item.title}
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          <Link to="/dashboard" className="orders-dd-link">
            View wishlist
          </Link>
        </div>
      )}
    </div>
  )
}

function HeaderIconButtons() {
  return (
    <div className="header-icon-group">
      <button type="button" className="header-icon-btn" aria-label="Notifications">
        <SvgIcon icon="headerBell" />
      </button>
      <button type="button" className="header-icon-btn" aria-label="Messages">
        <SvgIcon icon="headerMail" />
      </button>
    </div>
  )
}

function getOrdersFromStorage() {
  return utilService.loadFromStorage('orders', [])
}

function getWishlistFromStorage() {
  return utilService.loadFromStorage('wishlist', [])
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
