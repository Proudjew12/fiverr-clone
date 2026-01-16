import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { GigList } from '@/components/gig/GigList'
import { EmptyState } from '@/components/ui/EmptyState'
import { gigService } from '@/services/leo.service.local.js'

export function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('txt') || searchParams.get('q') || ''
  const [gigs, setGigs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadResults() {
      try {
        setIsLoading(true)
        const filterBy = {
          txt: query,
          tags: searchParams.getAll('tags'),
          minPrice: searchParams.get('minPrice'),
          maxPrice: searchParams.get('maxPrice'),
          topRated: searchParams.get('topRated') === 'true',
          basic: searchParams.get('basic') === 'true',
          level1: searchParams.get('level1') === 'true',
          level2: searchParams.get('level2') === 'true',
        }
        const data = await gigService.query(filterBy)
        if (isMounted) setGigs(data)
      } catch (err) {
        console.error('Failed to search gigs', err)
        if (isMounted) setGigs([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadResults()

    return () => {
      isMounted = false
    }
  }, [query, searchParams])

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
