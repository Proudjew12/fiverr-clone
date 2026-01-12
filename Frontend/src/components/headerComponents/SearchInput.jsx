import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function SearchInput() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function onFocusCapture() {
    document.body.classList.add('is-search-focused')
  }

  function onBlurCapture() {
    setTimeout(() => {
      const active = document.activeElement
      const stillInSearch = active?.closest?.('.search')
      if (!stillInSearch) document.body.classList.remove('is-search-focused')
    }, 0)
  }

  function onSubmit(ev) {
    ev.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
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
