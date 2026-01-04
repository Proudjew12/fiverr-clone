import { Outlet } from 'react-router-dom'
import { AppHeader } from '../components/layout/AppHeader.jsx'
import { AppFooter } from '../components/layout/AppFooter.jsx'

export function MainLayout() {
  return (
    <div className="main-layout">
      <AppHeader />

      <main className="main-content">
        <Outlet />
      </main>

      <AppFooter />
    </div>
  )
}
