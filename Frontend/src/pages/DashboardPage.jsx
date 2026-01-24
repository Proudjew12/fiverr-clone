import { useMemo } from 'react'

const PROFILE_IMAGE = '/assets/ProfileImgs/personOne.png'

export function DashboardPage() {
  const userName = localStorage.getItem('userName') || 'ProudJew'
  const emptyImage = useMemo(() => PROFILE_IMAGE, [])

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
