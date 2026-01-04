import { useSearchParams } from 'react-router-dom'

export function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  return (
    <section className="search-results-page">
      <div className="container">
        <h1>Search results</h1>

        {query && (
          <p className="results-query">
            Results for: <strong>{query}</strong>
          </p>
        )}
      </div>
    </section>
  )
}
