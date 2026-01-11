import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './pages/MainLayout.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { SearchResultsPage } from './pages/SearchResultsPage.jsx'
import { AboutPage } from './pages/AboutPage.jsx'
import { GigIndex } from './pages/GigIndex.jsx'
import { GigDetails } from './pages/GigDetails.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/index" element={<GigIndex />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path='/gig/:gigId' element={<GigDetails/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
