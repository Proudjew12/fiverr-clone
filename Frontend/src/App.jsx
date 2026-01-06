import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './pages/MainLayout.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { SearchResultsPage } from './pages/SearchResultsPage.jsx'
import { AboutPage } from './pages/AboutPage.jsx'
import { ExplorerPage } from './pages/ExplorerPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/explorer" element={<ExplorerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
