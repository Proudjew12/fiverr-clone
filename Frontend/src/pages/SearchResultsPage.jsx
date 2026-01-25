import { GigList } from '@/components/gig/GigList'
import { EmptyState } from '@/components/ui/EmptyState'
import { useGigFilters } from '@/hooks/useGigFilters'
import { useGigResults } from '@/hooks/useGigResults'

export function SearchResultsPage() {
  const { filterBy } = useGigFilters()
  const { gigs, isLoading } = useGigResults(filterBy)
  const query = filterBy.txt

  const title = query ? (
    <>
      Results for <strong>{query}</strong>
    </>
  ) : (
    'Search results'
  )

  const resultsLabel = isLoading ? 'Loading results...' : `${gigs.length} results`

  return (
    <section className="search-results-page">
      <div className="container search-results-container">
        <header className="results-header">
          <h1 className="results-title">{title}</h1>

          <div className="results-toolbar">
            <div className="filters-row">
              <button className="filter-pill" type="button">
                Category <span className="dropdown-caret">v</span>
              </button>
              <button className="filter-pill" type="button">
                Service options <span className="dropdown-caret">v</span>
              </button>
              <button className="filter-pill" type="button">
                Seller details <span className="dropdown-caret">v</span>
              </button>
              <button className="filter-pill" type="button">
                Budget <span className="dropdown-caret">v</span>
              </button>
              <button className="filter-pill" type="button">
                Delivery time <span className="dropdown-caret">v</span>
              </button>
            </div>

            <div className="toggles-row">
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-track" aria-hidden="true" />
                <span className="toggle-label">Pro services</span>
              </label>

              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-track" aria-hidden="true" />
                <span className="toggle-label">
                  Instant response <span className="badge-new">New</span>
                </span>
              </label>
            </div>
          </div>

          <div className="results-meta">
            <span className="results-count">{resultsLabel}</span>
            <button className="sort-btn" type="button">
              Sort by: <strong>Relevance</strong>{' '}
              <span className="dropdown-caret">v</span>
            </button>
          </div>
        </header>

        {isLoading && <p>Loading...</p>}
        {!isLoading && !gigs.length && <EmptyState />}
        {!isLoading && !!gigs.length && (
          <div className="search-results-list">
            <GigList gigs={gigs} />
          </div>
        )}
      </div>
    </section>
  )
}
