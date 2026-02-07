import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams, useParams } from 'react-router-dom'
import { utilService } from '@/services/util.service'
import { orderService } from '@/services/order.service.remote.js'
import demoData from '@/data/demo-data.json'
import { useDashboardLists } from '@/hooks/useDashboardLists'
import { SvgIcon } from '@/components/svg/SvgIcon'
import {
  SOCKET_EMIT_SEND_MSG,
  SOCKET_EMIT_OPEN_ORDER_CHAT,
  SOCKET_EMIT_ORDER_CHAT_MSG,
  SOCKET_EMIT_SET_TOPIC,
  SOCKET_EMIT_UPDATE_REQUEST,
  SOCKET_EVENT_MSG_SENT,
  SOCKET_EVENT_ORDER_CHAT_MSG,
  SOCKET_EVENT_ORDER_CHAT_OPENED,
  SOCKET_EVENT_REQUEST_UPDATED,
  socketService,
} from '@/services/socket.service'

const SELLER_IMAGE = '/assets/ProfileImgs/PersonOne.png'
const CUSTOMER_IMAGE = '/assets/ProfileImgs/PersonTwo.png'
const FALLBACK_THUMBS = demoData.fallbackThumbs
const NEW_REQUEST_WINDOW_MS = 5 * 60 * 1000
const DISCOUNT_RATE = 0.5
const AUTO_DISCOUNT_MESSAGE = 'היי! מגיע לך 50% הנחה על ההזמנה. רוצה שאפעיל לך את זה?'
const CUSTOMER_DISCOUNT_REPLY = 'תודה רבה! אשמח'

function getOrderTimestamp(order) {
  const rawTime = order?.createdAt ?? order?.updatedAt
  if (typeof rawTime === 'number' && Number.isFinite(rawTime)) return rawTime
  if (typeof rawTime === 'string') {
    const parsed = Date.parse(rawTime)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function isFreshPendingRequest(order, resolvedStatus, nowMs) {
  if (resolvedStatus !== 'pending') return false
  const createdAt = getOrderTimestamp(order)
  if (!createdAt) return false
  const age = nowMs - createdAt
  return age >= 0 && age <= NEW_REQUEST_WINDOW_MS
}

function buildFallbackOrderFromMessage(message) {
  if (!message?.orderId) return null
  return {
    _id: message.orderId,
    gigId: message.gigId,
    title: message.gigTitle || 'Gig',
    sellerName: message.sellerName || 'Seller',
    buyerName: message.buyerName || 'Customer',
    status: 'Ask',
    total: Number(message.total || 0),
  }
}

function isChatOrderRelevant(order, isSeller, userName) {
  if (!order?._id) return false
  if (isSeller) return true
  if (!order.buyerName) return true
  return order.buyerName === userName
}

function isChatMessageRelevant(message, isSeller, userName) {
  if (!message?.orderId) return false
  if (isSeller) return true
  if (!message.buyerName) return true
  return message.buyerName === userName
}

function isDiscountReply(text) {
  return String(text || '').trim() === CUSTOMER_DISCOUNT_REPLY
}

function createMessageId() {
  return `${Date.now()}-${utilService.makeId(8)}`
}

function getNowTimestamp() {
  return Date.now()
}

function getOrderDateLabel(seed) {
  const base = String(seed || 'default-seed')
  let hash = 0
  for (let i = 0; i < base.length; i++) {
    hash = (hash * 31 + base.charCodeAt(i)) >>> 0
  }
  const start = new Date(2025, 0, 1).getTime()
  const end = new Date(2026, 11, 31).getTime()
  const dayMs = 24 * 60 * 60 * 1000
  const rangeDays = Math.max(1, Math.floor((end - start) / dayMs))
  const offsetDays = hash % rangeDays
  const date = new Date(start + offsetDays * dayMs)
  return date.toLocaleDateString()
}

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { role } = useParams()
  const isSeller = role === 'seller'
  const userName = isSeller ? 'Harrison Parker' : 'Wilson Gray'
  const { orders, setOrders, wishlist, clearOrders, clearWishlist } = useDashboardLists({
    buyerName: userName,
    isSeller,
  })
  const emptyImage = useMemo(() => (isSeller ? SELLER_IMAGE : CUSTOMER_IMAGE), [isSeller])
  const activeTab =
    isSeller ? 'orders' : searchParams.get('tab') === 'wishlist' ? 'wishlist' : 'orders'

  const [requestStates, setRequestStates] = useState({})
  const [openRequestMenuId, setOpenRequestMenuId] = useState(null)
  const requestMenuRef = useRef(null)
  const ordersRef = useRef([])
  const [activeCustomerChat, setActiveCustomerChat] = useState(null)
  const [customerChatInput, setCustomerChatInput] = useState('')
  const [orderChatMessages, setOrderChatMessages] = useState([])
  const [highlightNowMs, setHighlightNowMs] = useState(() => getNowTimestamp())
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

  const appendOrderChatMessage = useCallback((message) => {
    if (!message?.id) return
    setOrderChatMessages((prevMessages) => {
      if (prevMessages.some((prevMessage) => prevMessage.id === message.id)) {
        return prevMessages
      }
      return [...prevMessages, message]
    })
  }, [])

  const resolveChatOrder = useCallback((orderCandidate, messageCandidate = null) => {
    const sourceOrders = ordersRef.current
    if (orderCandidate?._id) {
      const existingOrder = sourceOrders.find((order) => order._id === orderCandidate._id)
      return existingOrder ? { ...existingOrder, ...orderCandidate } : orderCandidate
    }
    const fallbackOrder = buildFallbackOrderFromMessage(messageCandidate)
    if (!fallbackOrder?._id) return null
    const existingOrder = sourceOrders.find((order) => order._id === fallbackOrder._id)
    return existingOrder ? { ...existingOrder, ...fallbackOrder } : fallbackOrder
  }, [])

  useEffect(() => {
    localStorage.setItem('isSeller', String(isSeller))
  }, [isSeller])

  useEffect(() => {
    if (!isSeller) return
    const intervalId = window.setInterval(() => {
      setHighlightNowMs(getNowTimestamp())
    }, 30000)
    return () => window.clearInterval(intervalId)
  }, [isSeller])

  useEffect(() => {
    ordersRef.current = orders
  }, [orders])
  
  useEffect(() => {
    if (isSeller) return
    socketService.emit(SOCKET_EMIT_SET_TOPIC, 'request')
    const handleRequestUpdated = (updated) => {
      setOrders((prev) => [...prev.filter((order) => order._id !== updated._id), updated])

      const nextStatus = String(updated?.status || '').toLowerCase()
      if (nextStatus !== 'ask') return

      const nextOrder = resolveChatOrder(updated, updated?._chatBootstrap)
      if (!isChatOrderRelevant(nextOrder, isSeller, userName)) return

      setActiveCustomerChat(nextOrder)
      if (isChatMessageRelevant(updated?._chatBootstrap, isSeller, userName)) {
        appendOrderChatMessage(updated._chatBootstrap)
      }
    }
    socketService.on(SOCKET_EVENT_REQUEST_UPDATED, handleRequestUpdated)
    return () => {
      socketService.off(SOCKET_EVENT_REQUEST_UPDATED, handleRequestUpdated)
    }
  }, [appendOrderChatMessage, isSeller, resolveChatOrder, setOrders, userName])

  useEffect(() => {
    if (!activeCustomerChat) return
    socketService.emit(SOCKET_EMIT_SET_TOPIC, 'chat')
  }, [activeCustomerChat])

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

  useEffect(() => {
    function handleOrderChatOpened(payload) {
      const nextOrder = resolveChatOrder(payload?.order, payload?.message)
      if (!isChatOrderRelevant(nextOrder, isSeller, userName)) return

      setActiveCustomerChat(nextOrder)
      setOrders((prevOrders) => {
        if (!nextOrder?._id) return prevOrders
        const exists = prevOrders.some((order) => order._id === nextOrder._id)
        if (!exists) return [{ ...nextOrder, status: 'Ask' }, ...prevOrders]
        return prevOrders.map((order) =>
          order._id === nextOrder._id ? { ...order, ...nextOrder, status: 'Ask' } : order
        )
      })

      if (isChatMessageRelevant(payload?.message, isSeller, userName)) {
        appendOrderChatMessage(payload.message)
      }
    }

    function handleOrderChatMessage(message) {
      if (!isChatMessageRelevant(message, isSeller, userName)) return
      appendOrderChatMessage(message)

      const updatedOrder = message?.updatedOrder
      if (updatedOrder?._id && isChatOrderRelevant(updatedOrder, isSeller, userName)) {
        setOrders((prevOrders) => {
          const exists = prevOrders.some((order) => order._id === updatedOrder._id)
          if (!exists) return [updatedOrder, ...prevOrders]
          return prevOrders.map((order) =>
            order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
          )
        })
      }

      const nextOrder = resolveChatOrder(null, message)
      if (!isChatOrderRelevant(nextOrder, isSeller, userName)) return
      setActiveCustomerChat((prevOrder) =>
        prevOrder?._id === nextOrder._id
          ? { ...prevOrder, ...(updatedOrder || {}) }
          : nextOrder
      )
    }

    socketService.on(SOCKET_EVENT_ORDER_CHAT_OPENED, handleOrderChatOpened)
    socketService.on(SOCKET_EVENT_ORDER_CHAT_MSG, handleOrderChatMessage)
    socketService.on(SOCKET_EVENT_MSG_SENT, handleOrderChatMessage)

    return () => {
      socketService.off(SOCKET_EVENT_ORDER_CHAT_OPENED, handleOrderChatOpened)
      socketService.off(SOCKET_EVENT_ORDER_CHAT_MSG, handleOrderChatMessage)
      socketService.off(SOCKET_EVENT_MSG_SENT, handleOrderChatMessage)
    }
  }, [appendOrderChatMessage, isSeller, resolveChatOrder, setOrders, userName])

  async function onUpdateRequest(order, status) {
    const statusLabel = getStatusLabel(status)
    const updated = { ...order, status: statusLabel }
    setRequestStates((prev) => ({ ...prev, [order._id]: status }))
    setOpenRequestMenuId(null)
    try {
      const savedOrder = await orderService.save(updated)
      window.dispatchEvent(new CustomEvent('orders-updated'))
      if (status === 'ask') {
        const text = AUTO_DISCOUNT_MESSAGE
        const initialMessage = {
          id: createMessageId(),
          orderId: savedOrder._id,
          gigId: savedOrder.gigId,
          gigTitle: savedOrder.title,
          sellerName: savedOrder.sellerName || 'Seller',
          buyerName: savedOrder.buyerName || 'Customer',
          text,
          createdAt: getNowTimestamp(),
          from: 'seller',
        }
        socketService.emit(SOCKET_EMIT_OPEN_ORDER_CHAT, {
          order: savedOrder,
          message: initialMessage,
        })
        // Fallback for older socket backends that only rebroadcast `update-request`.
        socketService.emit(SOCKET_EMIT_UPDATE_REQUEST, {
          ...savedOrder,
          _chatBootstrap: initialMessage,
        })
        appendOrderChatMessage(initialMessage)
        setActiveCustomerChat(savedOrder)
      } else {
        // Keep status updates live on older socket backends.
        socketService.emit(SOCKET_EMIT_UPDATE_REQUEST, savedOrder)
      }
    } catch (err) {
      console.error('Failed to update order status', err)
    }
  }

  const activeCustomerMessages = activeCustomerChat
    ? orderChatMessages
        .filter((message) => message.orderId === activeCustomerChat._id)
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
    : []
  const canShowDiscountSuggestion =
    !isSeller &&
    !!activeCustomerChat &&
    !activeCustomerChat.discountApplied &&
    activeCustomerMessages.some(
      (message) => message.from === 'seller' && message.text === AUTO_DISCOUNT_MESSAGE
    ) &&
    !activeCustomerMessages.some(
      (message) => message.from === 'customer' && isDiscountReply(message.text)
    )

  async function handleCustomerSend(forcedText = '') {
    if (!activeCustomerChat) return
    const text = String(forcedText || customerChatInput).trim()
    if (!text) return
    const isDiscountApproval = !isSeller && isDiscountReply(text)
    let updatedOrder = null

    if (isDiscountApproval) {
      const originalTotal = Number(
        activeCustomerChat.originalTotal ?? activeCustomerChat.total ?? 0
      )
      const discountedTotal = Number((originalTotal * DISCOUNT_RATE).toFixed(2))
      const discountPayload = {
        ...activeCustomerChat,
        originalTotal,
        total: discountedTotal,
        discountApplied: true,
      }
      try {
        updatedOrder = await orderService.save(discountPayload)
        socketService.emit(SOCKET_EMIT_UPDATE_REQUEST, updatedOrder)
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
          )
        )
        setActiveCustomerChat((prevOrder) =>
          prevOrder?._id === updatedOrder._id ? { ...prevOrder, ...updatedOrder } : prevOrder
        )
      } catch (err) {
        console.error('Failed to apply discount on order', err)
      }
    }

    const entry = {
      id: createMessageId(),
      orderId: activeCustomerChat._id,
      gigId: activeCustomerChat.gigId,
      gigTitle: activeCustomerChat.title,
      sellerName: activeCustomerChat.sellerName || 'Seller',
      buyerName: activeCustomerChat.buyerName || 'Customer',
      text,
      createdAt: getNowTimestamp(),
      from: isSeller ? 'seller' : 'customer',
      updatedOrder,
    }
    appendOrderChatMessage(entry)
    socketService.emit(SOCKET_EMIT_ORDER_CHAT_MSG, entry)
    // Backward-compatible fallback for older socket backends.
    socketService.emit(SOCKET_EMIT_SEND_MSG, entry)
    setCustomerChatInput('')
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
            {isSeller && (
              <button
                type="button"
                className="dashboard-clear-btn"
                onClick={onClearOrders}
                disabled={!orders.length}
              >
                Clear requests
              </button>
            )}
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
                  const resolvedStatus =
                    requestStates[order._id] || String(order.status || '').toLowerCase()
                  const isIncomingRequest =
                    isSeller && isFreshPendingRequest(order, resolvedStatus, highlightNowMs)
                  const hasDiscount =
                    !!order.discountApplied ||
                    Number(order.originalTotal || 0) > Number(order.total || 0)
                  const originalTotal = Number(order.originalTotal ?? order.total ?? 0)
                  return (
                    <li
                      key={order._id}
                      className={`orders-row ${
                        isIncomingRequest ? 'orders-row--incoming-request' : ''
                      }`}
                    >
                      <div className="orders-cell">
                        <div className="orders-title-row">
                          <img
                            className="orders-thumb"
                            src={thumbSrc}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                          <Link className="orders-title" to={`/gig/${order.gigId}`}>
                            {order.title}
                          </Link>
                        </div>
                        <div className="orders-meta">{getOrderDateLabel(order._id)}</div>
                      </div>
                      <div className="orders-cell">
                        {hasDiscount ? (
                          <div className="orders-price-discount">
                            <span className="orders-price-old">{formatMoney(originalTotal)}</span>
                            <span className="orders-price-new">{formatMoney(order.total)}</span>
                          </div>
                        ) : (
                          formatMoney(order.total)
                        )}
                      </div>
                      <div className="orders-cell">
                        {isSeller ? (
                          (() => {
                            if (resolvedStatus === 'accepted' || resolvedStatus === 'declined') {
                              return (
                                <span
                                  className={`request-status ${resolvedStatus}`}
                                  aria-label={
                                    resolvedStatus === 'accepted'
                                      ? 'Accepted'
                                      : 'Declined'
                                  }
                                  title={
                                    resolvedStatus === 'accepted'
                                      ? 'Accepted'
                                      : 'Declined'
                                  }
                                >
                                  {resolvedStatus === 'accepted'
                                    ? '✓'
                                    : '✕'}
                                </span>
                              )
                            }
                            if (resolvedStatus === 'ask') {
                              return (
                                <div className="request-actions" ref={requestMenuRef}>
                                  <button
                                    type="button"
                                    className="request-status ask request-status-btn"
                                    aria-haspopup="menu"
                                    aria-expanded={openRequestMenuId === order._id}
                                    aria-label="Asked customer"
                                    title="Asked customer"
                                    onClick={() =>
                                      setOpenRequestMenuId((prev) =>
                                        prev === order._id ? null : order._id
                                      )
                                    }
                                  >
                                    ?
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
                                    </div>
                                  )}
                                </div>
                              )
                            }
                            return (
                              <div className="request-actions" ref={requestMenuRef}>
                                <button
                                  type="button"
                                  className={`request-menu-btn ${
                                    isIncomingRequest ? 'is-incoming' : ''
                                  }`}
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
                                  onClick={() => setActiveCustomerChat(order)}
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
                          <img
                            className="orders-thumb"
                            src={thumbSrc}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                          <Link className="orders-title" to={`/gig/${item.gigId}`}>
                            {item.title}
                          </Link>
                        </div>
                        <div className="orders-meta">{getOrderDateLabel(item._id)}</div>
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

      {activeCustomerChat && (
        <div className="customer-chat-widget" role="dialog" aria-label="Customer chat">
          <div className="customer-chat-header">
            <div className="customer-chat-meta">
              <div className="customer-chat-title">
                Message{' '}
                {isSeller
                  ? activeCustomerChat.buyerName || 'Customer'
                  : activeCustomerChat.sellerName || 'Seller'}
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
                  message.from === (isSeller ? 'seller' : 'customer')
                    ? 'is-customer'
                    : 'is-seller'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          {canShowDiscountSuggestion && (
            <div className="customer-chat-quick-actions">
              <button
                type="button"
                className="customer-chat-quick-btn"
                onClick={() => handleCustomerSend(CUSTOMER_DISCOUNT_REPLY)}
              >
                {CUSTOMER_DISCOUNT_REPLY}
              </button>
            </div>
          )}
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
