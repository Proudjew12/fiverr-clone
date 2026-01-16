import { Outlet, useLocation } from 'react-router-dom'
import { AppHeader } from '../components/layout/AppHeader.jsx'
import { AppFooter } from '../components/layout/AppFooter.jsx'
import { SubHeader } from '../components/layout/SubHeader.jsx'
import { SubFooter } from '../components/layout/SubFooter.jsx'

export function MainLayout() {
  const location = useLocation()
  const isPaymentPage = location.pathname.includes('/payment')
  const showSubHeader = location.pathname !== '/' && !isPaymentPage

  return (
    <div className="main-layout">
      {!isPaymentPage && <AppHeader />}
      {showSubHeader && <SubHeader />}

      <main className="main-content">
        <Outlet />
      </main>

      {!isPaymentPage && <SubFooter />}
      {!isPaymentPage && <AppFooter />}
    </div>
  )
}
