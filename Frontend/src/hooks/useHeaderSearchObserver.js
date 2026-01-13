import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function useHeaderSearchObserver({
  selector = '.home-hero-search',
  enabledOnPath = '/',
  rootMargin = '-80px 0px 0px 0px',
  threshold = 0,
} = {}) {
  const location = useLocation()
  const [showHeaderSearch, setShowHeaderSearch] = useState(true)

  useEffect(() => {
    if (location.pathname !== enabledOnPath) {
      setShowHeaderSearch(true)
      return
    }

    if (!selector) {
      setShowHeaderSearch(true)
      return
    }

    const target = document.querySelector(selector)
    if (!target) {
      setShowHeaderSearch(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowHeaderSearch(!entry.isIntersecting)
      },
      { threshold, rootMargin }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [location.pathname, selector, enabledOnPath, rootMargin, threshold])

  return showHeaderSearch
}
