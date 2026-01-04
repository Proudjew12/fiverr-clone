import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function SearchBar({ initialValue = '', placeholder = 'Search for services...' }) {
  const navigate = useNavigate()
  const [txt, setTxt] = useState(initialValue)

  function onSubmit(ev) {
    ev.preventDefault()

    const q = String(txt).trim()
    if (!q) return

    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <form className="search-bar" onSubmit={onSubmit} role="search">
      <label className="visually-hidden" htmlFor="search-input">
        Search
      </label>

      <input
        id="search-input"
        name="q"
        type="search"
        autoComplete="off"
        value={txt}
        placeholder={placeholder}
        onChange={(ev) => setTxt(ev.target.value)}
      />

      <button type="submit" className="btn">
        Search
      </button>
    </form>
  )
}
