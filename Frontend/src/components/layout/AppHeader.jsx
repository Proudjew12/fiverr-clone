import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
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
import { SOCKET_EMIT_SEND_MSG, SOCKET_EMIT_SET_TOPIC, SOCKET_EVENT_MSG_SENT, socketService } from '@/services/socket.service.js'

const DEFAULT_LOCALE = {
  langLabel: 'English',
  currencyCode: 'USD',
}
const FALLBACK_THUMBS = demoData.fallbackThumbs
const CUSTOMER_NAME = 'Wilson Gray'
const SELLER_NAME = 'Harrison Parker'
const CUSTOMER_IMAGE = '/assets/ProfileImgs/PersonTwo.png'
const NEW_REQUEST_WINDOW_MS = 5 * 60 * 1000

function getOrderTimestamp(order) {
  const rawTime = order?.createdAt ?? order?.updatedAt
  if (typeof rawTime === 'number' && Number.isFinite(rawTime)) return rawTime
  if (typeof rawTime === 'string') {
    const parsed = Date.parse(rawTime)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function isFreshPendingRequest(order, nowMs) {
  if (String(order?.status || '').toLowerCase() !== 'pending') return false
  const createdAt = getOrderTimestamp(order)
  if (!createdAt) return false
  const age = nowMs - createdAt
  return age >= 0 && age <= NEW_REQUEST_WINDOW_MS
}

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
  const [sellerInbox, setSellerInbox] = useState([])
  useEffect(() => {
    if (isSeller) {
      socketService.emit(SOCKET_EMIT_SET_TOPIC, 'chat')
      socketService.on(SOCKET_EVENT_MSG_SENT, handleSendMessage )
    }
    function handleGlow() {
      setSignInGlow(true)
      setTimeout(() => setSignInGlow(false), 1200)
    }
    window.addEventListener('highlight-signin', handleGlow)
    return () => {
      window.removeEventListener('highlight-signin', handleGlow)
    }
  }, [])

  function handleSendMessage(msg){
    setSellerInbox(prev=>[...prev,msg])
  }

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
            sellerInbox={sellerInbox}
            setSellerInbox={setSellerInbox}
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
            sellerInbox={sellerInbox}
            setSellerInbox={setSellerInbox}
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

function HeaderMiddle({ openDd, onToggleDd, onCloseDd, isSignedIn,sellerInbox,setSellerInbox }) {
  return (
    <div className="header-mid flex items-center">
      <HeaderDropdowns
        openDd={openDd}
        onToggleDd={onToggleDd}
        onCloseDd={onCloseDd}
        isSignedIn={isSignedIn}
        sellerInbox={sellerInbox}
        setSellerInbox={setSellerInbox}
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
  sellerInbox,
  setSellerInbox
}) {
  const dashboardLink = isSeller ? '/dashboard/seller' : '/dashboard/customer'
  return (
    <nav
      className={`header-nav flex items-center ${isSignedIn ? 'is-signed-in' : 'is-signed-out'
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
            sellerInbox={sellerInbox}
            setSellerInbox={setSellerInbox}
          />
        ) : (
          <HeaderActions onSignIn={onSignIn} glow={signInGlow} />
        )}
      </div>

      {!isSignedIn && <JoinButton />}
    </nav>
  )
}

function HeaderDropdowns({ openDd, onToggleDd, onCloseDd, isSignedIn, sellerInbox, setSellerInbox }) {
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
  sellerInbox,
  setSellerInbox,
  onToggleSeller,
  dashboardLink,
}) {
  return (
    <>
      <HeaderIconButtons
        isSeller={isSeller}
        openDd={openDd}
        onToggleDd={onToggleDd}
        onCloseDd={onCloseDd}
        sellerInbox={sellerInbox}
        setSellerInbox={setSellerInbox}
      />
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
  const [highlightNowMs, setHighlightNowMs] = useState(0)
  const label = isSeller ? 'Requests' : 'Orders'
  const emptyLabel = isSeller ? 'No requests yet' : 'No orders yet'
  const viewLabel = isSeller ? 'View all requests' : 'View all orders'

  useEffect(() => {
    if (!isSeller) return
    setHighlightNowMs(Date.now())
    const intervalId = window.setInterval(() => {
      setHighlightNowMs(Date.now())
    }, 30000)
    return () => window.clearInterval(intervalId)
  }, [isSeller])

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
                const isIncomingRequest =
                  isSeller && isFreshPendingRequest(order, highlightNowMs)
                const orderLink = isSeller
                  ? `${dashboardLink}?tab=orders`
                  : `/gig/${order.gigId}`
                return (
                  <li
                    key={order._id}
                    className={`orders-dd-item ${
                      isIncomingRequest ? 'orders-dd-item--incoming-request' : ''
                    }`}
                  >
                    <img className="orders-dd-thumb" src={thumbSrc} alt="" />
                    <div className="orders-dd-content">
                      <Link
                        to={orderLink}
                        className="orders-dd-title"
                        onClick={onClose}
                      >
                        {order.title}
                      </Link>
                      {isIncomingRequest && <span className="orders-dd-tag">New request</span>}
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

function HeaderIconButtons({ isSeller, openDd, onToggleDd, onCloseDd, sellerInbox,setSellerInbox }) {
  const isMessagesOpen = openDd === 'messages'
  const [activeChat, setActiveChat] = useState(null)
  const [chatInput, setChatInput] = useState('')
  const hasUnread = sellerInbox.some(
    (message) => message.unread && message.from !== 'seller'
  )

  function loadInbox() {
    try {
      const stored = JSON.parse(localStorage.getItem('sellerInbox') || '[]')
      setSellerInbox(Array.isArray(stored) ? stored : [])
    } catch {
      setSellerInbox([])
    }
  }

  function saveInbox(nextInbox) {
    setSellerInbox(nextInbox)
    localStorage.setItem('sellerInbox', JSON.stringify(nextInbox))
  }

  function clearInbox() {
    saveInbox([])
    setActiveChat(null)
  }
  function handleSendFromCostumer(message) {
    if (!message) return
    saveInbox([message, ...sellerInbox])
  }
  useEffect(() => {
    if (!isSeller) return

    loadInbox()
    function handleInboxUpdate() {
      loadInbox()
    }
    window.addEventListener('seller-inbox-updated', handleInboxUpdate)
    window.addEventListener('storage', handleInboxUpdate)


    return () => {
      window.removeEventListener('seller-inbox-updated', handleInboxUpdate)
      window.removeEventListener('storage', handleInboxUpdate)

    }
  }, [isSeller])

  const conversations = useMemo(() => {
    const map = new Map()
    sellerInbox.forEach((message) => {
      const key = `${message.gigId || 'gig'}-${message.customerName || 'customer'}`
      const prev = map.get(key)
      const unreadCount =
        (prev?.unreadCount || 0) + (message.unread && message.from !== 'seller' ? 1 : 0)
      const data = {
        key,
        gigId: message.gigId,
        gigTitle: message.gigTitle || 'Gig',
        customerName: message.customerName || 'Customer',
        customerImg: message.customerImg || CUSTOMER_IMAGE,
        preview: message.text,
        lastCreatedAt: message.createdAt || 0,
        unreadCount,
      }
      if (!prev || data.lastCreatedAt >= prev.lastCreatedAt) {
        map.set(key, { ...data, unreadCount })
      } else {
        map.set(key, { ...prev, unreadCount })
      }
    })
    return Array.from(map.values()).sort(
      (a, b) => (b.lastCreatedAt || 0) - (a.lastCreatedAt || 0)
    )
  }, [sellerInbox])

  const activeMessages = useMemo(() => {
    if (!activeChat) return []
    return sellerInbox
      .filter(
        (message) =>
          `${message.gigId || 'gig'}-${message.customerName || 'customer'}` ===
          activeChat.key
      )
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
  }, [sellerInbox, activeChat])

  function markConversationRead(conversationKey) {
    const nextInbox = sellerInbox.map((message) => {
      const key = `${message.gigId || 'gig'}-${message.customerName || 'customer'}`
      if (key !== conversationKey) return message
      return { ...message, unread: false }
    })
    saveInbox(nextInbox)
  }

  function handleToggleMessages() {
    if (isMessagesOpen) {
      onCloseDd()
      return
    }
    onToggleDd('messages')
  }

  function openConversation(conversation) {
    setActiveChat(conversation)
    markConversationRead(conversation.key)
    onCloseDd()
  }

  function handleSendFromSeller() {
    if (!activeChat) return
    const text = chatInput.trim()
    if (!text) return
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      gigId: activeChat.gigId,
      gigTitle: activeChat.gigTitle,
      customerName: activeChat.customerName,
      text,
      createdAt: Date.now(),
      unread: false,
      from: 'seller',
    }
    socketService.emit(SOCKET_EMIT_SEND_MSG, entry)
    setChatInput('')
  }
  function handleMessage(entry) {
    if (!entry) return
    saveInbox([entry, ...sellerInbox])
  }
  function addConversation(conversation) {
    console.log('lll');
  }
  useEffect(() => {
    if (!activeChat) return
    if (!sellerInbox.length) return
    socketService.emit(SOCKET_EMIT_SET_TOPIC, 'chat')
    socketService.on(SOCKET_EVENT_MSG_SENT, handleSendFromCostumer)
    const exists = sellerInbox.some((message) => {
      const key = `${message.gigId || 'gig'}-${message.customerName || 'customer'}`
      return key === activeChat.key
    })
    if (!exists) setActiveChat(null)
    return () => {
      socketService.off(SOCKET_EVENT_MSG_SENT, handleSendFromCostumer)
    }
  }, [sellerInbox, activeChat])
  return (
    <div className="header-icon-group">
      <button type="button" className="header-icon-btn" aria-label="Notifications">
        <SvgIcon icon="headerBell" />
      </button>
      {isSeller ? (
        <div className="nav-dd nav-dd-messages">
          <button
            type="button"
            className={`header-icon-btn ${hasUnread ? 'has-unread' : ''}`}
            aria-label="Messages"
            aria-expanded={isMessagesOpen}
            aria-haspopup="dialog"
            onClick={handleToggleMessages}
          >
            <SvgIcon icon="headerMail" />
          </button>
          {isMessagesOpen && (
            <div className="nav-dd-panel nav-dd-panel-messages" aria-label="Messages">
              <div className="messages-header-row">
                <div className="messages-header">Messages</div>
                <button
                  type="button"
                  className="messages-clear"
                  onClick={clearInbox}
                  disabled={!sellerInbox.length}
                >
                  Clear
                </button>
              </div>
              {!conversations.length && (
                <div className="messages-empty">No incoming messages yet.</div>
              )}
              <div className="messages-thread">
                {conversations.map((conversation) => (
                  <button
                    type="button"
                    key={conversation.key}
                    className={`messages-item ${conversation.unreadCount ? 'is-unread' : ''
                      }`}
                    onClick={() => openConversation(conversation)}
                  >
                    <div className="messages-avatar">
                      <img
                        src={conversation.customerImg || CUSTOMER_IMAGE}
                        alt={conversation.customerName}
                      />
                    </div>
                    <div className="messages-content">
                      <div className="messages-gig">{conversation.gigTitle}</div>
                      <div className="messages-meta">
                        From {conversation.customerName}
                      </div>
                      <div className="messages-preview">{conversation.preview}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <button type="button" className="header-icon-btn" aria-label="Messages">
          <SvgIcon icon="headerMail" />
        </button>
      )}
      {isSeller && activeChat && (
        <div className="seller-chat-widget" role="dialog" aria-label="Seller chat">
          <div className="seller-chat-header">
            <div className="seller-chat-avatar">
              <img
                src={activeChat.customerImg || CUSTOMER_IMAGE}
                alt={activeChat.customerName}
              />
            </div>
            <div className="seller-chat-meta">
              <div className="seller-chat-title">
                Message {activeChat.customerName}
              </div>
              <div className="seller-chat-subtitle">{activeChat.gigTitle}</div>
            </div>
            <button
              type="button"
              className="seller-chat-close"
              onClick={() => setActiveChat(null)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          <div className="seller-chat-thread">
            {activeMessages.map((message) => (
              <div
                key={message.id}
                className={`seller-chat-bubble ${message.from === 'seller' ? 'is-seller' : 'is-customer'
                  }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="seller-chat-footer">
            <input
              type="text"
              className="seller-chat-input"
              placeholder="Type your message..."
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleSendFromSeller()
                }
              }}
            />
            <button
              type="button"
              className="seller-chat-send"
              onClick={handleSendFromSeller}
              disabled={!chatInput.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
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
