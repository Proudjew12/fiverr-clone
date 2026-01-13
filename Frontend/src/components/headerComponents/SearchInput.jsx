import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gigService } from '@/services/leo.service.local.js'
import { utilService } from '@/services/util.service'

export function SearchInput() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const prevPathRef = useRef(location.pathname)

  useEffect(() => {
    return () => {
      document.body.classList.remove('is-search-focused')
    }
  }, [])

  useEffect(() => {
    const prevPath = prevPathRef.current
    const nextPath = location.pathname
    if (prevPath !== nextPath && !nextPath.startsWith('/search')) {
      setQuery('')
    }
    prevPathRef.current = nextPath
  }, [location.pathname])

  function onFocusCapture() {
    document.body.classList.add('is-search-focused')
  }

  function onBlurCapture() {
    setTimeout(() => {
      const active = document.activeElement
      const stillInSearch = active?.closest?.('.header-search')
      if (!stillInSearch) document.body.classList.remove('is-search-focused')
    }, 0)
  }

  function onSubmit(ev) {
    ev.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    document.body.classList.remove('is-search-focused')
    const filterBy = gigService.getDefaultFilter()
    filterBy.txt = trimmed
    const queryStr = utilService.buildQueryParams(filterBy)
    navigate(`/index?${queryStr}`)
  }

  return (
    <form
      className="search grid"
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
      onSubmit={onSubmit}
    >
      <input
        className="search-input search-input-long"
        type="search"
        autoComplete="off"
        placeholder="What service are you looking for today?"
        aria-label="Search services"
        value={query}
        onChange={(ev) => setQuery(ev.target.value)}
      />

      <input
        className="search-input search-input-short"
        type="search"
        autoComplete="off"
        placeholder="Find services"
        aria-label="Search services"
        value={query}
        onChange={(ev) => setQuery(ev.target.value)}
      />

      <button className="search-btn grid place-center" type="submit" aria-label="Search">
        <img
          className="search-icon"
          src="/assets/HeaderIcons/5[H].svg"
          alt=""
          draggable="false"
        />
      </button>
    </form>
  )
}
