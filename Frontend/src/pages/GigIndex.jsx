import { GigList } from '@/components/gig/GigList'
import { GigFilter } from '@/components/filter/GigFilter.jsx'
import { EmptyState } from '@/components/ui/EmptyState'
import { useGigFilters } from '@/hooks/useGigFilters'
import { useGigSearchResults } from '@/hooks/useGigSearchResults'
import { gigService } from '@/services/gig.service.remote.js'

export function GigIndex() {
  const { filterBy, setFilter, handleFieldChange, sortValue, isSortOn, toggleSort, setSortDirection, clearFilters } =
    useGigFilters()
  const isSignedIn = localStorage.getItem('isSignedIn') === 'true'
  const userName = localStorage.getItem('userName') || 'LeoUser'

  const { gigs, isLoading, setPage, totalPages, currentPage, paginatedGigs } =
    useGigSearchResults({ filterBy, pageSize: 8, firstPageSize: 16 })
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
          {!isLoading && totalPages > 1 && (
            <div className="gig-pagination">
              <button
                type="button"
                className="gig-pagination-arrow"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <svg
                  className="gig-pagination-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M5.093 13.031c.285.3.747.3 1.031 0a.801.801 0 0 0 0-1.09l-2.803-2.96h10.21c.402 0 .728-.345.728-.77 0-.426-.326-.77-.729-.77H3.173l2.951-3.118a.801.801 0 0 0 0-1.09.702.702 0 0 0-1.031 0L.97 7.589a.801.801 0 0 0 0 1.09l.07.072a.744.744 0 0 0 .01.01l4.043 4.271Z" />
                </svg>
              </button>

              <div className="gig-pagination-pages" role="navigation" aria-label="Pagination">
                {Array.from({ length: totalPages }, (_, idx) => {
                  const pageNumber = idx + 1
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      className={`gig-pagination-page ${
                        pageNumber === currentPage ? 'is-active' : ''
                      }`}
                      onClick={() => setPage(pageNumber)}
                      aria-current={pageNumber === currentPage ? 'page' : undefined}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                className="gig-pagination-arrow"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <svg
                  className="gig-pagination-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M9.923 2.969a.702.702 0 0 0-1.031 0 .801.801 0 0 0 0 1.09l2.804 2.96H1.486c-.403 0-.73.345-.73.77 0 .426.327.77.73.77h10.358l-2.952 3.118a.801.801 0 0 0 0 1.09c.285.3.747.3 1.031 0l4.123-4.355a.801.801 0 0 0 0-1.09l-.069-.072a1.422 1.422 0 0 0-.01-.01L9.923 2.969Z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>

      <aside className="side-col right"></aside>
    </div>
  )
}
