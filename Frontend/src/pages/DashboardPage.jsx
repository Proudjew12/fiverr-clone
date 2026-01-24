import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { utilService } from '@/services/util.service'
import demoData from '@/data/demo-data.json'

const PROFILE_IMAGE = '/assets/ProfileImgs/personOne.png'
const ORDERS_STORAGE_KEY = 'orders'
const FALLBACK_THUMBS = demoData.fallbackThumbs
const WISHLIST_STORAGE_KEY = 'wishlist'

export function DashboardPage() {
  const [searchParams] = useSearchParams()
  const userName = localStorage.getItem('userName') || 'ProudJew'
  const [orders, setOrders] = useState(() => loadOrders())
  const [wishlist, setWishlist] = useState(() => loadWishlist())
  const [activeTab, setActiveTab] = useState(
    () => searchParams.get('tab') || 'orders'
  )
  const emptyImage = useMemo(() => PROFILE_IMAGE, [])

  useEffect(() => {
    function updateOrders() {
      setOrders(loadOrders())
    }

    function updateWishlist() {
      setWishlist(loadWishlist())
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

  useEffect(() => {
    const nextTab = searchParams.get('tab')
    if (nextTab === 'wishlist' || nextTab === 'orders') {
      setActiveTab(nextTab)
    }
  }, [searchParams])

  const formatMoney = (value) => `₪${Number(value).toFixed(2)}`
  function onClearOrders() {
    clearOrders()
    setOrders([])
  }

  function onClearWishlist() {
    clearWishlist()
    setWishlist([])
  }

  return (
    <section className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-card profile-card">
          <img className="profile-avatar" src={emptyImage} alt={`${userName} avatar`} />
          <h2 className="profile-name">{userName}</h2>
          <p className="profile-role">Buyer</p>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-row">
            <div>
              <h1>{activeTab === 'orders' ? 'Manage Orders' : 'Wishlist'}</h1>
              <p className="dashboard-subtitle">
                {activeTab === 'orders'
                  ? 'All your orders will appear here.'
                  : 'All your saved gigs will appear here.'}
              </p>
            </div>
            {activeTab === 'orders' ? (
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
            )}
          </div>
          <div className="dashboard-tabs">
            <button
              type="button"
              className={`dashboard-tab ${activeTab === 'orders' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Manage Orders
            </button>
            <button
              type="button"
              className={`dashboard-tab ${activeTab === 'wishlist' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              Wishlist
            </button>
          </div>
        </header>

        <section
          className={`dashboard-card orders-card ${
            activeTab === 'orders' && orders.length ? 'has-orders' : ''
          } ${activeTab === 'wishlist' && wishlist.length ? 'has-orders' : ''}`}
        >
          {activeTab === 'orders' && !orders.length && (
            <div className="orders-empty">
              <div>
                <h3>No orders yet</h3>
                <p>When you place an order, it will show up here.</p>
              </div>
            </div>
          )}

          {activeTab === 'orders' && !!orders.length && (
            <div className="orders-table">
              <div className="orders-head">
                <span>Order</span>
                <span>Total</span>
                <span>Status</span>
              </div>
              <ul className="orders-list">
                {orders.map((order) => {
                  const thumbSrc =
                    order.previewImg || utilService.pickRandom(FALLBACK_THUMBS)
                  return (
                    <li key={order.id} className="orders-row">
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
                        <span className="orders-status">{order.status}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {activeTab === 'wishlist' && !wishlist.length && (
            <div className="orders-empty">
              <div>
                <h3>No items yet</h3>
                <p>Tap the heart on a gig to save it here.</p>
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && !!wishlist.length && (
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

function loadOrders() {
  return utilService.loadFromStorage(ORDERS_STORAGE_KEY, [])
}

function clearOrders() {
  utilService.saveToStorage(ORDERS_STORAGE_KEY, [])
  window.dispatchEvent(new CustomEvent('orders-updated'))
}

function loadWishlist() {
  return utilService.loadFromStorage(WISHLIST_STORAGE_KEY, [])
}

function clearWishlist() {
  utilService.saveToStorage(WISHLIST_STORAGE_KEY, [])
  window.dispatchEvent(new CustomEvent('wishlist-updated'))
}
