import { GigList } from '@/components/gig/GigList'
import { gigService } from '@/services/leo.service.local.js'
import { useEffect, useState } from 'react'
import { GigFilter } from '@/components/filter/GigFilter.jsx'
import { utilService } from '@/services/util.service'
import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '@/components/ui/EmptyState'

export function GigIndex() {
  const [gigs, setGigs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchParams,setSearchParams] = useSearchParams()

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
  const visibleGigs = query ? gigs.slice(0, 5) : gigs

  useEffect(() => {
    let isMounted = true

    async function loadGigs() {
      try {
        setIsLoading(true)
        const data = await gigService.query(filterBy)
        if (isMounted) setGigs(data)
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

  function onSetFilter(filterUpdate) {
    setSearchParams(prevParams => {
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
                  {isLoading
                    ? 'Loading results...'
                    : `${visibleGigs.length} results`}
                </span>
              </div>
            </header>
          )}

          <GigFilter filterBy={filterBy}  onSetFilter={onSetFilter}/>
          <button
            className="random-gig-btn"
            onClick={() => {
              utilService.makeRandomGig()
            }}
          >
            Random Gig
          </button>
          {isLoading && <div>Loading...</div>}
          {!isLoading && !visibleGigs.length && <EmptyState />}
          {!isLoading && !!visibleGigs.length && <GigList gigs={visibleGigs} />}
        </div>
      </main>

      <aside className="side-col right"></aside>
    </div>
  )
}
