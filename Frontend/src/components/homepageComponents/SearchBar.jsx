import { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gigService } from '@/services/leo.service.local.js'
import { utilService } from '@/services/util.service'

export function SearchBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const longInputRef = useRef(null)
  const shortInputRef = useRef(null)
  const formKey = location.pathname

  function onSubmit(ev) {
    ev.preventDefault()
    const raw =
      longInputRef.current?.value || shortInputRef.current?.value || ''
    const trimmed = raw.trim()
    if (!trimmed) return
    const filterBy = gigService.getDefaultFilter()
    filterBy.txt = trimmed
    const queryStr = utilService.buildQueryParams(filterBy)
    navigate(`/index?${queryStr}`)
  }

  return (
    <form key={formKey} className="search grid" onSubmit={onSubmit}>
      <input
        ref={longInputRef}
        className="search-input search-input-long"
        type="search"
        autoComplete="off"
        placeholder="What service are you looking for today?"
        aria-label="Search services"
      />

      <input
        ref={shortInputRef}
        className="search-input search-input-short"
        type="search"
        autoComplete="off"
        placeholder="Find services"
        aria-label="Search services"
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
