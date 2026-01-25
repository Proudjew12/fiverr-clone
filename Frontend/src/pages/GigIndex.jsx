import { GigList } from '@/components/gig/GigList'
import { gigService } from '@/services/leo.service.local.js'
import { useEffect, useMemo, useState } from 'react'
import { GigFilter } from '@/components/filter/GigFilter.jsx'
import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '@/components/ui/EmptyState'
import demoData from '@/data/demo-data.json'

export function GigIndex() {
  const [gigs, setGigs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams()
  const isSignedIn = localStorage.getItem('isSignedIn') === 'true'
  const userName = localStorage.getItem('userName') || 'ProudJew'
  const pageSize = 8

  const filterBy = {
    txt: searchParams.get('txt') || searchParams.get('q') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
    tags: searchParams.getAll('tags') || [],
    topRated: searchParams.get('topRated') === 'true',
    basic: searchParams.get('basic') === 'true',
    level1: searchParams.get('level1') === 'true',
    level2: searchParams.get('level2') === 'true',
  }
  const query = filterBy.txt
  const totalPages = Math.max(1, Math.ceil(gigs.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginatedGigs = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize
    return gigs.slice(startIdx, startIdx + pageSize)
  }, [gigs, currentPage, pageSize])

  useEffect(() => {
    let isMounted = true

    async function loadGigs() {
      try {
        setIsLoading(true)
        const data = await gigService.query(filterBy)
        const demoGigs = buildDemoGigs(data, demoData.randomGig.videos)
        if (isMounted) setGigs(demoGigs)
      } catch (err) {
        console.error('err', err)
        if (isMounted) setGigs([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadGigs()

    return () => {
      isMounted = false
    }
  }, [searchParams])

  useEffect(() => {
    setPage(1)
  }, [searchParams])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  function onSetFilter(filterUpdate) {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams)

      for (const field in filterUpdate) {
        const value = filterUpdate[field]

        if (value === '' || value === null || value === undefined || value === false) {
          newParams.delete(field)
        } else if (Array.isArray(value)) {
          newParams.delete(field)
          value.filter(Boolean).forEach((entry) => newParams.append(field, entry))
        } else {
          newParams.set(field, value)
        }
      }
      return newParams
    })
  }

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

          <GigFilter filterBy={filterBy} onSetFilter={onSetFilter} />

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

function buildDemoGigs(source = [], demoVideos = []) {
  if (!source.length) return []
  if (!demoVideos.length) return source

  return demoVideos.map((videoSrc, idx) => {
    const base = source[idx % source.length]
    return {
      ...base,
      _id: `${base._id}-demo-${idx + 1}`,
      videoUrls: [videoSrc],
    }
  })
}
