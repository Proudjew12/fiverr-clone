import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { utilService } from '@/services/util.service'

const PROFILE_IMAGE = '/assets/ProfileImgs/personOne.png'
const ORDERS_STORAGE_KEY = 'orders'
const DASHBOARD_FALLBACK_THUMBS = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200&q=80',
]

export function DashboardPage() {
  const userName = localStorage.getItem('userName') || 'ProudJew'
  const [orders, setOrders] = useState(() => loadOrders())
  const emptyImage = useMemo(() => PROFILE_IMAGE, [])

  useEffect(() => {
    function updateOrders() {
      setOrders(loadOrders())
    }

    window.addEventListener('storage', updateOrders)
    window.addEventListener('orders-updated', updateOrders)

    return () => {
      window.removeEventListener('storage', updateOrders)
      window.removeEventListener('orders-updated', updateOrders)
    }
  }, [])

  const formatMoney = (value) => `₪${Number(value).toFixed(2)}`
  function onClearOrders() {
    clearOrders()
    setOrders([])
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
              <h1>Manage Orders</h1>
              <p className="dashboard-subtitle">All your orders will appear here.</p>
            </div>
            <button
              type="button"
              className="dashboard-clear-btn"
              onClick={onClearOrders}
              disabled={!orders.length}
            >
              Clear orders
            </button>
          </div>
        </header>

        <section className={`dashboard-card orders-card ${orders.length ? 'has-orders' : ''}`}>
          {!orders.length && (
            <div className="orders-empty">
              <div>
                <h3>No orders yet</h3>
                <p>When you place an order, it will show up here.</p>
              </div>
            </div>
          )}

          {!!orders.length && (
            <div className="orders-table">
              <div className="orders-head">
                <span>Order</span>
                <span>Total</span>
                <span>Status</span>
              </div>
              <ul className="orders-list">
                {orders.map((order) => {
                  const thumbSrc =
                    order.previewImg || utilService.pickRandom(DASHBOARD_FALLBACK_THUMBS)
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
