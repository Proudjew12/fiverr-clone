import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { utilService } from '@/services/util.service'
import demoData from '@/data/demo-data.json'
import { useDashboardLists } from '@/hooks/useDashboardLists'
import { SvgIcon } from '@/components/svg/SvgIcon'

const PROFILE_IMAGE = '/assets/ProfileImgs/personOne.png'
const FALLBACK_THUMBS = demoData.fallbackThumbs

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const userName = localStorage.getItem('userName') || 'LeoUser'
  const isSeller = localStorage.getItem('isSeller') === 'true'
  const { orders, wishlist, clearOrders, clearWishlist } = useDashboardLists()
  const emptyImage = useMemo(() => PROFILE_IMAGE, [])
  const activeTab =
    isSeller ? 'orders' : searchParams.get('tab') === 'wishlist' ? 'wishlist' : 'orders'

  const [requestStates, setRequestStates] = useState({})
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

  function onUpdateRequest(id, status) {
    setRequestStates((prev) => ({ ...prev, [id]: status }))
  }

  return (
    <section className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-card profile-card">
          <img className="profile-avatar" src={emptyImage} alt={`${userName} avatar`} />
          <h2 className="profile-name">{userName}</h2>
          <p className="profile-role">{isSeller ? 'Seller' : 'Buyer'}</p>
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
                    ? 'When a buyer sends a request, it will show up here.'
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
                {orders.map((order) => {
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
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="orders-cell">{formatMoney(order.total)}</div>
                      <div className="orders-cell">
                        {isSeller ? (
                          requestStates[order._id] ? (
                            <span className={`request-status ${requestStates[order._id]}`}>
                              {requestStates[order._id] === 'accepted'
                                ? 'Accepted'
                                : 'Declined'}
                            </span>
                          ) : (
                            <div className="request-actions">
                              <button
                                type="button"
                                className="request-action accept"
                                onClick={() => onUpdateRequest(order._id, 'accepted')}
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                className="request-action reject"
                                onClick={() => onUpdateRequest(order._id, 'declined')}
                              >
                                Decline
                              </button>
                            </div>
                          )
                        ) : (
                          <span className="orders-status">{order.status}</span>
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
                    <li key={item.id} className="orders-row">
                      <div className="orders-cell">
                        <div className="orders-title-row">
                          <img className="orders-thumb" src={thumbSrc} alt="" />
                          <Link className="orders-title" to={`/gig/${item.gigId}`}>
                            {item.title}
                          </Link>
                        </div>
                        <div className="orders-meta">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
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
    </section>
  )
}
