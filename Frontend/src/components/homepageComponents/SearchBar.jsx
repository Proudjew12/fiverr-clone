import { useSearchForm } from '@/hooks/useSearchForm'
import { SvgIcon } from '@/components/svg/SvgIcon'

export function SearchBar() {
  const { longInputRef, shortInputRef, formKey, onSubmit } = useSearchForm()

  return (
    <form key={formKey} className="search grid" onSubmit={onSubmit}>
      <input
        ref={longInputRef}
        className="search-input search-input-long"
        type="search"
        autoComplete="off"
        placeholder="Search for any service..."
        aria-label="Search services"
      />

      <input
        ref={shortInputRef}
        className="search-input search-input-short"
        type="search"
        autoComplete="off"
        placeholder="Search"
        aria-label="Search services"
      />

      <button className="search-btn grid place-center" type="submit" aria-label="Search">
        <SvgIcon icon="heroSearch" className="search-icon" aria-hidden="true" />
      </button>
    </form>
  )
}
