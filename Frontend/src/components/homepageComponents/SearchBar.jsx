import { useSearchForm } from '@/hooks/useSearchForm'

export function SearchBar() {
  const { longInputRef, shortInputRef, formKey, onSubmit } = useSearchForm()

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
