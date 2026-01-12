import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { GigList } from '@/components/gig/GigList'
import { gigService } from '@/services/fiverr.service.local.js'

export function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [gigs, setGigs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    gigService
      .query({ txt: query })
      .then((data) => {
        if (isMounted) setGigs(data)
      })
      .catch((err) => {
        console.error('Failed to search gigs', err)
        if (isMounted) setGigs([])
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [query])

  return (
    <section className="search-results-page">
      <div className="container">
        <h1>Search results</h1>

        {query && (
          <p className="results-query">
            Results for: <strong>{query}</strong>
          </p>
        )}

        {isLoading && <p>Loading...</p>}
        {!isLoading && !gigs.length && <p>No results found.</p>}
        {!isLoading && !!gigs.length && <GigList gigs={gigs} />}
      </div>
    </section>
  )
}
