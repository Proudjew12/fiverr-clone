import { useSearchForm } from '@/hooks/useSearchForm'
import { SvgIcon } from '@/components/svg/SvgIcon'

export function SearchBar() {
  const { longInputRef, shortInputRef, formKey, onSubmit } = useSearchForm()

  return (
    <form key={formKey} className="home-hero-search-form" onSubmit={onSubmit}>
      <input
        ref={longInputRef}
        className="home-hero-search-input home-hero-search-input-long"
        type="search"
        autoComplete="off"
        placeholder="Search for any service..."
        aria-label="Search services"
      />

      <input
        ref={shortInputRef}
        className="home-hero-search-input home-hero-search-input-short"
        type="search"
        autoComplete="off"
        placeholder="Search"
        aria-label="Search services"
      />

      <button className="home-hero-search-btn" type="submit" aria-label="Search">
        <SvgIcon icon="heroSearch" className="home-hero-search-icon" aria-hidden="true" />
      </button>
    </form>
  )
}
