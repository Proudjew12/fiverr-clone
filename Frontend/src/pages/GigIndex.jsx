import { GigList } from '@/components/gig/GigList'
import { gigService } from '@/services/leo.service.local.js'
import { utilService } from '@/services/util.service'
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

  const filterBy = useMemo(
    () => ({
      txt: searchParams.get('txt') || searchParams.get('q') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sort: searchParams.get('sort') || '',
      tags: searchParams.getAll('tags') || [],
      topRated: searchParams.get('topRated') === 'true',
      basic: searchParams.get('basic') === 'true',
      level1: searchParams.get('level1') === 'true',
      level2: searchParams.get('level2') === 'true',
    }),
    [searchParams]
  )
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
        const data = await gigService.query({})
        const demoGigs = buildDemoGigs(data, demoData.randomGig.videos)
        const filteredGigs = applyDemoFilters(demoGigs, filterBy)
        if (isMounted) setGigs(filteredGigs)
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
  }, [filterBy])

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

  const categories = demoData.subHeader.categories || []
  return demoVideos.map((videoSrc, idx) => {
    const base = source[idx % source.length]
    const owner = base.owner || {}
    const fullname = utilService.pickRandom(demoData.randomGig.fullnames)
    const rate =
      Math.round((Math.random() * (5 - 3.8) + 3.8) * 10) / 10
    const price = utilService.getRandomIntInclusive(20, 500)
    const title = utilService.pickRandom(demoData.randomGig.titles)
    const category = categories[idx % categories.length]
    const tag = category?.tag
    return {
      ...base,
      _id: `${base._id}-demo-${idx + 1}`,
      title,
      owner: {
        ...owner,
        fullname,
        rate,
      },
      price,
      tags: tag ? [tag] : base.tags || [],
      videoUrls: [videoSrc],
    }
  })
}

function applyDemoFilters(gigs, filterBy) {
  let filtered = [...gigs]
  const txt = String(filterBy.txt || '').trim().toLowerCase()
  const tags = Array.isArray(filterBy.tags) ? filterBy.tags.filter(Boolean) : []
  const minPrice = filterBy.minPrice === '' ? null : Number(filterBy.minPrice)
  const maxPrice = filterBy.maxPrice === '' ? null : Number(filterBy.maxPrice)
  const levels = []
  if (filterBy.topRated) levels.push('top rated')
  if (filterBy.basic) levels.push('basic')
  if (filterBy.level1) levels.push('1')
  if (filterBy.level2) levels.push('2')

  if (levels.length) {
    filtered = filtered.filter((gig) =>
      levels.includes(String(gig.owner?.level || '').toLowerCase())
    )
  }

  if (txt) {
    filtered = filtered.filter((gig) => {
      const haystack = [
        gig.title,
        gig.description,
        gig.owner?.fullname,
        ...(gig.tags || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(txt)
    })
  }

  if (tags.length) {
    filtered = filtered.filter((gig) =>
      tags.every((tag) => (gig.tags || []).includes(tag))
    )
  }

  if (minPrice !== null && !Number.isNaN(minPrice)) {
    filtered = filtered.filter((gig) => (gig.price || 0) >= minPrice)
  }

  if (maxPrice !== null && !Number.isNaN(maxPrice)) {
    filtered = filtered.filter((gig) => (gig.price || 0) <= maxPrice)
  }

  if (filterBy.sort === 'price-asc') {
    filtered = filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
  }
  if (filterBy.sort === 'price-desc') {
    filtered = filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
  }

  return filtered
}
