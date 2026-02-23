import { Suspense, lazy } from 'react'
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom'

const MainLayout = lazy(() => import('./pages/MainLayout.jsx').then((mod) => ({ default: mod.MainLayout })))
const HomePage = lazy(() => import('./pages/HomePage.jsx').then((mod) => ({ default: mod.HomePage })))
const AboutPage = lazy(() => import('./pages/AboutPage.jsx').then((mod) => ({ default: mod.AboutPage })))
const GigIndex = lazy(() => import('./pages/GigIndex.jsx').then((mod) => ({ default: mod.GigIndex })))
const GigDetails = lazy(() => import('./pages/GigDetails.jsx').then((mod) => ({ default: mod.GigDetails })))
const PaymentPage = lazy(() => import('./pages/PaymentPage.jsx').then((mod) => ({ default: mod.PaymentPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx').then((mod) => ({ default: mod.DashboardPage })))

function getBrowserBasename() {
  const baseUrl = import.meta.env.BASE_URL || '/'
  if (baseUrl === '/') return undefined
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}

function App() {
  const useHashRouter = import.meta.env.VITE_ROUTER_MODE === 'hash'
  const Router = useHashRouter ? HashRouter : BrowserRouter
  const browserBasename = getBrowserBasename()

  return (
    <Router {...(!useHashRouter && browserBasename ? { basename: browserBasename } : {})}>
      <Suspense fallback={<div className="app-loader">Loading...</div>}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/index" element={<GigIndex />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gig" element={<Navigate to="/index" replace />} />
            <Route path="/gig/:gigId" element={<GigDetails />} />
            <Route path="/gig/:gigId/payment/:price" element={<PaymentPage />} />
            <Route path="/dashboard" element={<Navigate to="/dashboard/customer" replace />} />
            <Route path="/dashboard/:role" element={<DashboardPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
