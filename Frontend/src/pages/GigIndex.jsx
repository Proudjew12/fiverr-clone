import { GigList } from '@/components/gig/GigList'
import { GigFilter } from '@/components/filter/GigFilter.jsx'
import { EmptyState } from '@/components/ui/EmptyState'
import { useGigFilters } from '@/hooks/useGigFilters'
import { useGigSearchResults } from '@/hooks/useGigSearchResults'

export function GigIndex() {
  const { filterBy, setFilter, handleFieldChange, sortValue, isSortOn, toggleSort, setSortDirection, clearFilters } =
    useGigFilters()
  const isSignedIn = localStorage.getItem('isSignedIn') === 'true'
  const userName = localStorage.getItem('userName') || 'LeoUser'

  const {
    gigs,
    isLoading,
    setPage,
    pageSize,
    totalPages,
    currentPage,
    paginatedGigs,
  } = useGigSearchResults({ filterBy, pageSize: 8 })
  const query = filterBy.txt

  return (
    <div className="main-layout-index">
      {isSignedIn && (
        <section className="welcome-banner" aria-label="Welcome">
          <div className="welcome-banner-inner">
            <h2 className="welcome-title">Welcome back, {userName}</h2>
          </div>
        </section>
      )}

      <aside className="side-col left"></aside>

      <main>
        <div className="search-results-container">
          {query && (
            <header className="results-header">
              <h1 className="results-title">
                <>
                  Results for <strong>{query}</strong>
                </>
              </h1>

              <div className="results-meta">
                <span className="results-count">
                  {isLoading ? 'Loading results...' : `${gigs.length} results`}
                </span>
              </div>
            </header>
          )}

          <GigFilter
            filterBy={filterBy}
            onSetFilter={setFilter}
            onFieldChange={handleFieldChange}
            sortValue={sortValue}
            isSortOn={isSortOn}
            onToggleSort={toggleSort}
            onSortDirectionChange={setSortDirection}
            onClearFilters={clearFilters}
          />

          {isLoading && <div>Loading...</div>}
          {!isLoading && !paginatedGigs.length && <EmptyState />}
          {!isLoading && !!paginatedGigs.length && <GigList gigs={paginatedGigs} />}
          {!isLoading && gigs.length > pageSize && (
            <div className="gig-pagination">
              {currentPage > 1 && (
                <button
                  type="button"
                  className="gig-pagination-btn"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Back
                </button>
              )}
              <span className="gig-pagination-meta">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <button
                  type="button"
                  className="gig-pagination-btn"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <aside className="side-col right"></aside>
    </div>
  )
}
