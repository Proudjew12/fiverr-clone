import { Outlet, useLocation } from 'react-router-dom'
import { AppHeader } from '../components/layout/AppHeader.jsx'
import { AppFooter } from '../components/layout/AppFooter.jsx'
import { SubHeader } from '../components/layout/SubHeader.jsx'
import { SubFooter } from '../components/layout/SubFooter.jsx'

export function MainLayout() {
  const location = useLocation()
  const showSubHeader = location.pathname !== '/'

  return (
    <div className="main-layout">
      <AppHeader />
      {showSubHeader && <SubHeader />}

      <main className="main-content">
        <Outlet />
      </main>

      <SubFooter />
      <AppFooter />
    </div>
  )
}
