export function SearchInput() {
  function onFocusCapture() {
    document.body.classList.add('is-search-focused')
  }

  function onBlurCapture() {
    // wait a tick so focus moving within the search won't instantly remove
    setTimeout(() => {
      const active = document.activeElement
      const stillInSearch = active?.closest?.('.search')
      if (!stillInSearch) document.body.classList.remove('is-search-focused')
    }, 0)
  }

  return (
    <div
      className="search grid"
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
    >
      <input
        className="search-input search-input-long"
        type="search"
        autoComplete="off"
        placeholder="What service are you looking for today?"
        aria-label="Search services"
      />

      <input
        className="search-input search-input-short"
        type="search"
        autoComplete="off"
        placeholder="Find services"
        aria-label="Search services"
      />

      <button className="search-btn grid place-center" type="button" aria-label="Search">
        <img
          className="search-icon"
          src="/assets/HeaderIcons/5[H].svg"
          alt=""
          draggable="false"
        />
      </button>
    </div>
  )
}
