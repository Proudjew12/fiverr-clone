import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams, useParams } from 'react-router-dom'
import { utilService } from '@/services/util.service'
import { orderService } from '@/services/order.service.remote.js'
import demoData from '@/data/demo-data.json'
import { useDashboardLists } from '@/hooks/useDashboardLists'
import { SvgIcon } from '@/components/svg/SvgIcon'

const SELLER_IMAGE = '/assets/ProfileImgs/PersonOne.png'
const CUSTOMER_IMAGE = '/assets/ProfileImgs/PersonTwo.png'
const FALLBACK_THUMBS = demoData.fallbackThumbs

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { role } = useParams()
  const isSeller = role === 'seller'
  const userName = isSeller ? 'Harrison Parker' : 'Wilson Gray'
  const { orders, wishlist, clearOrders, clearWishlist } = useDashboardLists({
    buyerName: userName,
    isSeller,
  })
  const emptyImage = useMemo(() => (isSeller ? SELLER_IMAGE : CUSTOMER_IMAGE), [isSeller])
  const activeTab =
    isSeller ? 'orders' : searchParams.get('tab') === 'wishlist' ? 'wishlist' : 'orders'

  const [requestStates, setRequestStates] = useState({})
  const [openRequestMenuId, setOpenRequestMenuId] = useState(null)
  const requestMenuRef = useRef(null)
  const [customerInbox, setCustomerInbox] = useState([])
  const [activeCustomerChat, setActiveCustomerChat] = useState(null)
  const [customerChatInput, setCustomerChatInput] = useState('')
  const formatMoney = (value) => `₪${Number(value).toFixed(2)}`
  function setTab(tab) {
    setSearchParams((prevParams) => {
      const nextParams = new URLSearchParams(prevParams)
      nextParams.set('tab', tab)
      return nextParams
    })
  }
  function onClearOrders() {
    clearOrders()
  }

  function onClearWishlist() {
    clearWishlist()
  }

  useEffect(() => {
    localStorage.setItem('isSeller', String(isSeller))
  }, [isSeller])

  useEffect(() => {
    if (isSeller) return
    function loadInbox() {
      try {
        const stored = JSON.parse(localStorage.getItem('customerInbox') || '[]')
        setCustomerInbox(Array.isArray(stored) ? stored : [])
      } catch {
        setCustomerInbox([])
      }
    }
    function handleInboxUpdate() {
      loadInbox()
    }
    loadInbox()
    window.addEventListener('customer-inbox-updated', handleInboxUpdate)
    window.addEventListener('storage', handleInboxUpdate)
    return () => {
      window.removeEventListener('customer-inbox-updated', handleInboxUpdate)
      window.removeEventListener('storage', handleInboxUpdate)
    }
  }, [isSeller])

  useEffect(() => {
    function handleOutsideClick(ev) {
      if (!requestMenuRef.current) return
      if (!requestMenuRef.current.contains(ev.target)) {
        setOpenRequestMenuId(null)
      }
    }

    function handleEscape(ev) {
      if (ev.key === 'Escape') setOpenRequestMenuId(null)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  function getStatusLabel(status) {
    if (status === 'accepted') return 'Accepted'
    if (status === 'declined') return 'Declined'
    if (status === 'ask') return 'Ask'
    return status
  }

  function pushCustomerInboxMessage(order, text) {
    if (!order || !text) return
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      orderId: order._id,
      gigId: order.gigId,
      gigTitle: order.title,
      sellerName: order.sellerName || 'Seller',
      text,
      createdAt: Date.now(),
      unread: true,
      from: 'seller',
    }
    let inbox = []
    try {
      const stored = localStorage.getItem('customerInbox')
      inbox = stored ? JSON.parse(stored) : []
    } catch {
      inbox = []
    }
    const nextInbox = [entry, ...(Array.isArray(inbox) ? inbox : [])].slice(0, 30)
    localStorage.setItem('customerInbox', JSON.stringify(nextInbox))
    window.dispatchEvent(new Event('customer-inbox-updated'))
  }

  function pushSellerInboxMessage(order, text) {
    if (!order || !text) return
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      gigId: order.gigId,
      gigTitle: order.title,
      customerName: order.buyerName || 'Customer',
      customerImg: '/assets/ProfileImgs/PersonTwo.png',
      text,
      createdAt: Date.now(),
      unread: true,
      from: 'customer',
    }
    let inbox = []
    try {
      const stored = localStorage.getItem('sellerInbox')
      inbox = stored ? JSON.parse(stored) : []
    } catch {
      inbox = []
    }
    const nextInbox = [entry, ...(Array.isArray(inbox) ? inbox : [])].slice(0, 30)
    localStorage.setItem('sellerInbox', JSON.stringify(nextInbox))
    window.dispatchEvent(new Event('seller-inbox-updated'))
  }

  async function onUpdateRequest(order, status) {
    const statusLabel = getStatusLabel(status)
    const updated = { ...order, status: statusLabel }
    setRequestStates((prev) => ({ ...prev, [order._id]: status }))
    setOpenRequestMenuId(null)
    try {
      await orderService.save(updated)
      window.dispatchEvent(new CustomEvent('orders-updated'))
      if (status === 'ask') {
        const message =
          'Hi there! Before I start, could you share the requirements, timeline, and any brand/style notes you want me to follow?'
        pushCustomerInboxMessage(updated, message)
      }
    } catch (err) {
      console.error('Failed to update order status', err)
    }
  }

  const activeCustomerMessages = activeCustomerChat
    ? customerInbox
        .filter((message) => message.orderId === activeCustomerChat._id)
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
    : []

  function handleCustomerSend() {
    if (!activeCustomerChat) return
    const text = customerChatInput.trim()
    if (!text) return
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      orderId: activeCustomerChat._id,
      gigId: activeCustomerChat.gigId,
      gigTitle: activeCustomerChat.title,
      sellerName: activeCustomerChat.sellerName || 'Seller',
      text,
      createdAt: Date.now(),
      unread: false,
      from: 'customer',
    }
    const nextInbox = [entry, ...customerInbox]
    localStorage.setItem('customerInbox', JSON.stringify(nextInbox))
    setCustomerInbox(nextInbox)
    setCustomerChatInput('')
    pushSellerInboxMessage(activeCustomerChat, text)
  }

  function getRandomOrderDate(seed) {
    const base = String(seed || '') || Math.random().toString(36)
    let hash = 0
    for (let i = 0; i < base.length; i++) {
      hash = (hash * 31 + base.charCodeAt(i)) >>> 0
    }
    const start = new Date(2025, 0, 1).getTime()
    const end = new Date(2026, 11, 31).getTime()
    const dayMs = 24 * 60 * 60 * 1000
    const rangeDays = Math.floor((end - start) / dayMs)
    const offsetDays = hash % rangeDays
    const date = new Date(start + offsetDays * dayMs)
    return date.toLocaleDateString()
  }

  return (
    <section className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-card profile-card">
          <img className="profile-avatar" src={emptyImage} alt={`${userName} avatar`} />
          <h2 className="profile-name">{userName}</h2>
          <p className="profile-role">{isSeller ? 'Seller' : 'Customer'}</p>
          {isSeller && (
            <div className="profile-rating">
              <div className="profile-stars" aria-label="Seller rating">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <SvgIcon key={idx} icon="star" />
                ))}
              </div>
              <span className="profile-rating-value">4.8</span>
            </div>
          )}
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-row">
            <div>
              <h1>
                {isSeller
                  ? 'Manage Requests'
                  : activeTab === 'orders'
                    ? 'Manage Orders'
                    : 'Wishlist'}
              </h1>
              <p className="dashboard-subtitle">
                {isSeller
                  ? 'All your requests will appear here.'
                  : activeTab === 'orders'
                    ? 'All your orders will appear here.'
                    : 'All your saved gigs will appear here.'}
              </p>
            </div>
            {!isSeller &&
              (activeTab === 'orders' ? (
                <button
                  type="button"
                  className="dashboard-clear-btn"
                  onClick={onClearOrders}
                  disabled={!orders.length}
                >
                  Clear orders
                </button>
              ) : (
                <button
                  type="button"
                  className="dashboard-clear-btn"
                  onClick={onClearWishlist}
                  disabled={!wishlist.length}
                >
                  Clear wishlist
                </button>
              ))}
          </div>
          {!isSeller && (
            <div className="dashboard-tabs">
              <button
                type="button"
                className={`dashboard-tab ${
                  activeTab === 'orders' ? 'is-active' : ''
                }`}
                onClick={() => setTab('orders')}
              >
                Manage Orders
              </button>
              <button
                type="button"
                className={`dashboard-tab ${
                  activeTab === 'wishlist' ? 'is-active' : ''
                }`}
                onClick={() => setTab('wishlist')}
              >
                Wishlist
              </button>
            </div>
          )}
        </header>

        <section
          className={`dashboard-card orders-card ${
            activeTab === 'orders' && orders.length ? 'has-orders' : ''
          } ${activeTab === 'wishlist' && wishlist.length ? 'has-orders' : ''}`}
        >
          {activeTab === 'orders' && !orders.length && (
            <div className="orders-empty">
              <div>
                <h3>{isSeller ? 'No requests yet' : 'No orders yet'}</h3>
                <p>
                  {isSeller
                    ? 'When a customer sends a request, it will show up here.'
                    : 'When you place an order, it will show up here.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'orders' && !!orders.length && (
            <div className={`orders-table ${isSeller ? 'orders-table--seller' : ''}`}>
              <div className="orders-head">
                <span>{isSeller ? 'Request' : 'Order'}</span>
                <span>Total</span>
                <span>{isSeller ? 'Action' : 'Status'}</span>
              </div>
              <ul className="orders-list">
                {(isSeller ? orders.slice(0, 3) : orders).map((order) => {
                  const thumbSrc =
                    order.previewImg || utilService.pickRandom(FALLBACK_THUMBS)
                  return (
                    <li key={order._id} className="orders-row">
                      <div className="orders-cell">
                        <div className="orders-title-row">
                          <img className="orders-thumb" src={thumbSrc} alt="" />
                          <Link className="orders-title" to={`/gig/${order.gigId}`}>
                            {order.title}
                          </Link>
                        </div>
                      <div className="orders-meta">
                        {getRandomOrderDate(order._id)}
                      </div>
                      </div>
                      <div className="orders-cell">{formatMoney(order.total)}</div>
                      <div className="orders-cell">
                        {isSeller ? (
                          (() => {
                            const resolvedStatus =
                              requestStates[order._id] ||
                              String(order.status || '').toLowerCase()
                            if (
                              resolvedStatus === 'accepted' ||
                              resolvedStatus === 'declined' ||
                              resolvedStatus === 'ask'
                            ) {
                              return (
                                <span
                                  className={`request-status ${resolvedStatus}`}
                                  aria-label={
                                    resolvedStatus === 'accepted'
                                      ? 'Accepted'
                                      : resolvedStatus === 'declined'
                                        ? 'Declined'
                                        : 'Asked customer'
                                  }
                                  title={
                                    resolvedStatus === 'accepted'
                                      ? 'Accepted'
                                      : resolvedStatus === 'declined'
                                        ? 'Declined'
                                        : 'Asked customer'
                                  }
                                >
                                  {resolvedStatus === 'accepted'
                                    ? '✓'
                                    : resolvedStatus === 'declined'
                                      ? '✕'
                                      : '?'}
                                </span>
                              )
                            }
                            return (
                              <div className="request-actions" ref={requestMenuRef}>
                                <button
                                  type="button"
                                  className="request-menu-btn"
                                  aria-haspopup="menu"
                                  aria-expanded={openRequestMenuId === order._id}
                                  onClick={() =>
                                    setOpenRequestMenuId((prev) =>
                                      prev === order._id ? null : order._id
                                    )
                                  }
                                >
                                  <span aria-hidden="true">⋯</span>
                                </button>
                                {openRequestMenuId === order._id && (
                                  <div className="request-menu" role="menu">
                                    <button
                                      type="button"
                                      className="request-menu-item"
                                      onClick={() => onUpdateRequest(order, 'accepted')}
                                    >
                                      Accept
                                    </button>
                                    <button
                                      type="button"
                                      className="request-menu-item"
                                      onClick={() => onUpdateRequest(order, 'declined')}
                                    >
                                      Decline
                                    </button>
                                    <button
                                      type="button"
                                      className="request-menu-item"
                                      onClick={() => onUpdateRequest(order, 'ask')}
                                    >
                                      Ask the Customer
                                    </button>
                                  </div>
                                )}
                              </div>
                            )
                          })()
                        ) : (
                          (() => {
                            const statusText = String(order.status || '').toLowerCase()
                            if (statusText === 'ask') {
                              return (
                                <button
                                  type="button"
                                  className="orders-chat-btn"
                                  onClick={() => {
                                    setActiveCustomerChat(order)
                                    setCustomerInbox((prev) => {
                                      const nextInbox = prev.map((msg) =>
                                        msg.orderId === order._id
                                          ? { ...msg, unread: false }
                                          : msg
                                      )
                                      localStorage.setItem(
                                        'customerInbox',
                                        JSON.stringify(nextInbox)
                                      )
                                      return nextInbox
                                    })
                                  }}
                                >
                                  Open chat
                                </button>
                              )
                            }
                            return (
                              <span
                                className={`orders-status ${
                                  order.status
                                    ? order.status.toLowerCase().replace(/\s+/g, '-')
                                    : ''
                                }`}
                              >
                                {order.status}
                              </span>
                            )
                          })()
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {!isSeller && activeTab === 'wishlist' && !wishlist.length && (
            <div className="orders-empty">
              <div>
                <h3>No items yet</h3>
                <p>Tap the heart on a gig to save it here.</p>
              </div>
            </div>
          )}

          {!isSeller && activeTab === 'wishlist' && !!wishlist.length && (
            <div className="orders-table">
              <div className="orders-head">
                <span>Gig</span>
                <span>Price</span>
                <span>Status</span>
              </div>
              <ul className="orders-list">
                {wishlist.map((item) => {
                  const thumbSrc =
                    item.previewImg || utilService.pickRandom(FALLBACK_THUMBS)
                  return (
                    <li key={item._id || item.id} className="orders-row">
                      <div className="orders-cell">
                        <div className="orders-title-row">
                          <img className="orders-thumb" src={thumbSrc} alt="" />
                          <Link className="orders-title" to={`/gig/${item.gigId}`}>
                            {item.title}
                          </Link>
                        </div>
                        <div className="orders-meta">{getRandomOrderDate(item._id)}</div>
                      </div>
                      <div className="orders-cell">{formatMoney(item.price)}</div>
                      <div className="orders-cell">
                        <span className="orders-status wishlist-status">Saved</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </section>
      </main>

      {!isSeller && activeCustomerChat && (
        <div className="customer-chat-widget" role="dialog" aria-label="Customer chat">
          <div className="customer-chat-header">
            <div className="customer-chat-meta">
              <div className="customer-chat-title">
                Message {activeCustomerChat.sellerName || 'Seller'}
              </div>
              <div className="customer-chat-subtitle">{activeCustomerChat.title}</div>
            </div>
            <button
              type="button"
              className="customer-chat-close"
              onClick={() => setActiveCustomerChat(null)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          <div className="customer-chat-thread">
            {activeCustomerMessages.map((message) => (
              <div
                key={message.id}
                className={`customer-chat-bubble ${
                  message.from === 'customer' ? 'is-customer' : 'is-seller'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="customer-chat-footer">
            <input
              type="text"
              className="customer-chat-input"
              placeholder="Type your message..."
              value={customerChatInput}
              onChange={(event) => setCustomerChatInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleCustomerSend()
                }
              }}
            />
            <button
              type="button"
              className="customer-chat-send"
              onClick={handleCustomerSend}
              disabled={!customerChatInput.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
