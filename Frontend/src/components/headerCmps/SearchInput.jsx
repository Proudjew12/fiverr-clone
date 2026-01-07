// headerCmps/SearchInput.jsx
export function SearchInput() {
  return (
    <div className="search grid">
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
