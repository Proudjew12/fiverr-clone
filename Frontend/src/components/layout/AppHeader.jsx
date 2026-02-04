import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { utilService } from '@/services/util.service'

import { LeoProDd } from '@/components/headerComponents/ProDd'
import { LeoChange } from '@/components/headerComponents/LeoChange'
import { ExploreDd } from '@/components/headerComponents/ExploreDd'
import { SearchInput } from '@/components/headerComponents/SearchInput'
import { JoinModal } from '@/components/headerComponents/JoinModal'
import { SvgIcon } from '@/components/svg/SvgIcon'
import { useDropdown } from '@/hooks/useDropdown'
import { useHeaderSearchObserver } from '@/hooks/useHeaderSearchObserver'
import { useDashboardLists } from '@/hooks/useDashboardLists'
import demoData from '@/data/demo-data.json'

const DEFAULT_LOCALE = {
  langLabel: 'English',
  currencyCode: 'USD',
}
const FALLBACK_THUMBS = demoData.fallbackThumbs
const CUSTOMER_NAME = 'Wilson Gray'
const SELLER_NAME = 'Harrison Parker'

export function AppHeader() {
  const { openDd, toggleDd, closeDd, rootRef, getOptionProps } = useDropdown()
  const showHeaderSearch = useHeaderSearchObserver()
  const [isSignedIn, setIsSignedIn] = useState(
    () => localStorage.getItem('isSignedIn') === 'true'
  )
  const [isSeller, setIsSeller] = useState(
    () => localStorage.getItem('isSeller') === 'true'
  )
  const [signInGlow, setSignInGlow] = useState(false)
  const storedName = localStorage.getItem('userName')
  const fallbackName = isSeller ? SELLER_NAME : CUSTOMER_NAME
  const userName = storedName && storedName !== 'LeoUser' ? storedName : fallbackName
  if (!storedName || storedName === 'LeoUser') {
    localStorage.setItem('userName', fallbackName)
  }
  const { orders, wishlist } = useDashboardLists({ buyerName: userName, isSeller })
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    function handleGlow() {
      setSignInGlow(true)
      setTimeout(() => setSignInGlow(false), 1200)
    }

    window.addEventListener('highlight-signin', handleGlow)
    return () => window.removeEventListener('highlight-signin', handleGlow)
  }, [])

  function handleSignIn() {
    setIsSignedIn(true)
    setIsSeller(false)
    localStorage.setItem('isSignedIn', 'true')
    localStorage.setItem('userName', CUSTOMER_NAME)
    localStorage.setItem('isSeller', 'false')
    closeDd()
    navigate('/index')
  }

  function handleSignOut() {
    setIsSignedIn(false)
    localStorage.removeItem('isSignedIn')
    localStorage.removeItem('userName')
    localStorage.removeItem('isSeller')
    setIsSeller(false)
    closeDd()
    navigate('/')
  }

  function handleToggleSeller() {
    setIsSeller((prev) => {
      const next = !prev
      localStorage.setItem('isSeller', String(next))
      localStorage.setItem('userName', next ? SELLER_NAME : CUSTOMER_NAME)
      if (location.pathname.startsWith('/dashboard')) {
        window.location.assign(next ? '/dashboard/seller' : '/dashboard/customer')
      } else {
        window.location.reload()
      }
      return next
    })
  }

  return (
    <header ref={rootRef} className="app-header">
      <div className="app-header-row">
        <div className="app-header-inner flex items-center justify-between">
          <HeaderLeft showSearch={showHeaderSearch} />
          <HeaderMiddle
            openDd={openDd}
            onToggleDd={toggleDd}
            onCloseDd={closeDd}
            isSignedIn={isSignedIn}
          />
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
            isSeller={isSeller}
            onToggleSeller={handleToggleSeller}
            signInGlow={signInGlow}
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

function HeaderMiddle({ openDd, onToggleDd, onCloseDd, isSignedIn }) {
  return (
    <div className="header-mid flex items-center">
      <HeaderDropdowns
        openDd={openDd}
        onToggleDd={onToggleDd}
        onCloseDd={onCloseDd}
        isSignedIn={isSignedIn}
      />
    </div>
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
  isSeller,
  onToggleSeller,
  signInGlow,
}) {
  const dashboardLink = isSeller ? '/dashboard/seller' : '/dashboard/customer'
  return (
    <nav
      className={`header-nav flex items-center ${
        isSignedIn ? 'is-signed-in' : 'is-signed-out'
      }`}
      aria-label="Header"
    >
      <div className="nav-group nav-group-links flex items-center">
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
            isSeller={isSeller}
            onToggleSeller={onToggleSeller}
            dashboardLink={dashboardLink}
          />
        ) : (
          <HeaderActions onSignIn={onSignIn} glow={signInGlow} />
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

function HeaderActions({ onSignIn, glow }) {
  return (
    <>
      <button
        type="button"
        className={`header-link header-link-green ${glow ? 'is-glow' : ''}`}
        onClick={onSignIn}
      >
        Sign in
      </button>
    </>
  )
}

function JoinButton() {
  return (
    <JoinModal>
      <button type="button" className="join-btn grid place-center" aria-haspopup="dialog">
        Join
      </button>
    </JoinModal>
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
  isSeller,
  onToggleSeller,
  dashboardLink,
}) {
  return (
    <>
      <HeaderIconButtons />
      {!isSeller && (
        <WishlistDropdown
          isOpen={openDd === 'wishlist'}
          onToggle={() => onToggleDd('wishlist')}
          onClose={onCloseDd}
          wishlist={wishlist}
        />
      )}
      <OrdersDropdown
        isOpen={openDd === 'orders'}
        onToggle={() => onToggleDd('orders')}
        onClose={onCloseDd}
        orders={orders}
        isSeller={isSeller}
        dashboardLink={dashboardLink}
      />
      <UserDropdown
        isOpen={openDd === 'user'}
        onToggle={() => onToggleDd('user')}
        onClose={onCloseDd}
        getOptionProps={getOptionProps}
        onSignOut={onSignOut}
        isSeller={isSeller}
        onToggleSeller={onToggleSeller}
        dashboardLink={dashboardLink}
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

function OrdersDropdown({
  isOpen,
  onToggle,
  onClose,
  orders,
  isSeller,
  dashboardLink,
}) {
  const label = isSeller ? 'Requests' : 'Orders'
  const emptyLabel = isSeller ? 'No requests yet' : 'No orders yet'
  const viewLabel = isSeller ? 'View all requests' : 'View all orders'

  return (
    <div className="nav-dd">
      <button
        type="button"
        className="nav-dd-trigger"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={onToggle}
      >
        {label}
        <span className={`nav-arrow-down ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
          <SvgIcon icon="chevronDown" />
        </span>
      </button>

      {isOpen && (
        <div className="nav-dd-panel nav-dd-panel-orders" aria-label={label}>
          {!orders.length && <div className="orders-dd-empty">{emptyLabel}</div>}
          {!!orders.length && (
            <ul className="orders-dd-list">
              {orders.slice(0, 3).map((order) => {
                const thumbSrc =
                  order.previewImg || utilService.pickRandom(FALLBACK_THUMBS)
                return (
                  <li key={order._id} className="orders-dd-item">
                    <img className="orders-dd-thumb" src={thumbSrc} alt="" />
                    <div className="orders-dd-content">
                      <Link
                        to={`/gig/${order.gigId}`}
                        className="orders-dd-title"
                        onClick={onClose}
                      >
                        {order.title}
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          <Link
            to={`${dashboardLink}?tab=orders`}
            className="orders-dd-link"
            onClick={onClose}
          >
            {viewLabel}
          </Link>
        </div>
      )}
    </div>
  )
}

function WishlistDropdown({ isOpen, onToggle, onClose, wishlist = [] }) {
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
                  item.previewImg || utilService.pickRandom(FALLBACK_THUMBS)
                return (
                  <li key={item._id || item.id} className="orders-dd-item">
                    <img className="orders-dd-thumb" src={thumbSrc} alt="" />
                    <div className="orders-dd-content">
                      <Link
                        to={`/gig/${item.gigId}`}
                        className="orders-dd-title"
                        onClick={onClose}
                      >
                        {item.title}
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          <Link
            to="/dashboard/customer?tab=wishlist"
            className="orders-dd-link"
            onClick={onClose}
          >
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

function UserDropdown({
  isOpen,
  onToggle,
  onClose,
  onSignOut,
  isSeller,
  onToggleSeller,
  dashboardLink,
}) {
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
        <div
          className="nav-dd-panel nav-dd-panel-user"
          aria-label="User menu"
          role="menu"
        >
          <Link to={dashboardLink} className="user-menu-item" onClick={onClose}>
            Dashboard
          </Link>
          <button
            type="button"
            className="user-menu-item"
            onClick={() => {
              onToggleSeller()
              onClose()
            }}
          >
            {isSeller ? 'Become a Customer' : 'Become a Seller'}
          </button>
          <button type="button" className="user-menu-item" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
