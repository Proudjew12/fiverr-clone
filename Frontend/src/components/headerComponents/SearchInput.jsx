import { useEffect } from 'react'
import { useSearchForm } from '@/hooks/useSearchForm'

export function SearchInput() {
  const { longInputRef, shortInputRef, formKey, onSubmit } = useSearchForm({
    onBeforeNavigate: () => {
      document.body.classList.remove('is-search-focused')
    },
  })

  useEffect(() => {
    return () => {
      document.body.classList.remove('is-search-focused')
    }
  }, [])

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

  return (
    <form
      key={formKey}
      className="search grid"
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
      onSubmit={onSubmit}
    >
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
