import { useMemo } from 'react'

const DASHBOARD_IMAGES = [
  '/assets/Popular-Services/Video-Editing/img/0d93cdad-9c44-4d44-b3f2-6052d0faab17.png',
  '/assets/Popular-Services/Video-Editing/img/u104.jpg',
  '/assets/Popular-Services/Video-Editing/img/u106.jpg',
]

export function DashboardPage() {
  const userName = localStorage.getItem('userName') || 'ProudJew'
  const emptyImage = useMemo(
    () => DASHBOARD_IMAGES[Math.floor(Math.random() * DASHBOARD_IMAGES.length)],
    []
  )

  return (
    <section className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-card profile-card">
          <img className="profile-avatar" src={emptyImage} alt={`${userName} avatar`} />
          <h2 className="profile-name">{userName}</h2>
          <p className="profile-role">Buyer</p>
          <div className="rating-row">
            <span className="star-icon">★</span>
            <span className="score">4.9</span>
            <span className="count">(285)</span>
          </div>
        </div>

        <div className="dashboard-card stats-card">
          <div className="stat-row">
            <span>Member since</span>
            <strong>May 2021</strong>
          </div>
          <div className="stat-row">
            <span>Response rate</span>
            <strong>98%</strong>
          </div>
          <div className="stat-row">
            <span>Delivered on time</span>
            <strong>96%</strong>
          </div>
          <div className="stat-row">
            <span>Order completion</span>
            <strong>100%</strong>
          </div>
        </div>

        <div className="dashboard-card progress-card">
          <div className="progress-row">
            <div className="progress-label">Response rate</div>
            <div className="progress-track">
              <span className="progress-fill" style={{ width: '98%' }} />
            </div>
          </div>
          <div className="progress-row">
            <div className="progress-label">Delivered on time</div>
            <div className="progress-track">
              <span className="progress-fill" style={{ width: '96%' }} />
            </div>
          </div>
          <div className="progress-row">
            <div className="progress-label">Order completion</div>
            <div className="progress-track">
              <span className="progress-fill" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Manage Orders</h1>
          <p className="dashboard-subtitle">All your orders will appear here.</p>
        </header>

        <section className="dashboard-card orders-card">
          <div className="orders-empty">
            <img src={emptyImage} alt="" className="orders-empty-img" />
            <div>
              <h3>No orders yet</h3>
              <p>When you place an order, it will show up here.</p>
            </div>
          </div>
        </section>
      </main>
    </section>
  )
}
