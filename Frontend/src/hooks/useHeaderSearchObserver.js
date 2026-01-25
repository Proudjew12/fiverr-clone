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
  const canObserve = location.pathname === enabledOnPath && selector

  useEffect(() => {
    if (!canObserve) {
      return
    }

    const target = document.querySelector(selector)
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowHeaderSearch(!entry.isIntersecting)
      },
      { threshold, rootMargin }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [canObserve, selector, rootMargin, threshold])

  return canObserve ? showHeaderSearch : true
}
