import { useSearchParams } from 'react-router-dom'

export function SellerDetailsFilter({ handleChange, counts }) {
  const [searchParams] = useSearchParams()

  return (
    <div
      className="dropdown-container dropdown-container--seller"
      onClick={(ev) => ev.stopPropagation()}
    >
      <div className="checks-container">
        <label className="check-filter">
          <input
            type="checkbox"
            name="topRated"
            checked={searchParams.get('topRated') === 'true' || false}
            onChange={handleChange}
          />
          <span className="check-text">
            <span className="check-label">Top Rated Seller</span>
            <span className="filter-count">({counts?.topRated || 0})</span>
          </span>
        </label>

        <label className="check-filter">
          <input
            type="checkbox"
            name="level2"
            checked={searchParams.get('level2') === 'true' || false}
            onChange={handleChange}
          />
          <span className="check-text">
            <span className="check-label">Level 2</span>
            <span className="filter-count">({counts?.level2 || 0})</span>
          </span>
        </label>

        <label className="check-filter">
          <input
            type="checkbox"
            name="level1"
            checked={searchParams.get('level1') === 'true' || false}
            onChange={handleChange}
          />
          <span className="check-text">
            <span className="check-label">Level 1</span>
            <span className="filter-count">({counts?.level1 || 0})</span>
          </span>
        </label>

        <label className="check-filter">
          <input
            type="checkbox"
            name="basic"
            checked={searchParams.get('basic') === 'true' || false}
            onChange={handleChange}
          />
          <span className="check-text">
            <span className="check-label">New Seller</span>
            <span className="filter-count">({counts?.basic || 0})</span>
          </span>
        </label>
      </div>
    </div>
  )
}
