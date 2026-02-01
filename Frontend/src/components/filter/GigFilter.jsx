import { useMemo, useState } from 'react'
import { SellerDetailsFilter } from './SellerDetailsFilter.jsx'
import { BudgetFilter } from './BudgetFilter.jsx'
import { gigService } from '@/services/gig.service.remote.js'

export function GigFilter({
  filterBy,
  onSetFilter,
  onFieldChange,
  sortValue,
  isSortOn,
  onToggleSort,
  onSortDirectionChange,
  onClearFilters,
}) {
  const defaultFilter = useMemo(() => gigService.getDefaultFilter(), [])
  const [activeFilter, setActiveFilter] = useState(null)

  const hasActiveFilters = useMemo(() => {
    if (!filterBy) return !!isSortOn

    const hasValue = Object.keys(defaultFilter).some((key) => {
      const value = filterBy[key]
      const fallback = defaultFilter[key]

      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'string') return value.trim() !== '' && value !== fallback
      if (typeof value === 'number') return value !== fallback && !Number.isNaN(value)
      if (typeof value === 'boolean') return value !== fallback
      return value !== null && value !== undefined && value !== fallback
    })

    return hasValue || isSortOn
  }, [defaultFilter, filterBy, isSortOn])

  function onToggleFilter(filterName) {
    setActiveFilter((prevFilter) => (prevFilter === filterName ? null : filterName))
  }
  function handleChange(ev) {
    onFieldChange(ev)
    setActiveFilter(null)
  }

  function handleClear() {
    onClearFilters()
    setActiveFilter(null)
  }


  return (
    <section className="gig-filter ">
      <div className="dropdown">

        <div className="filter-dropdown" onClick={() => onToggleFilter('service_options')}>
          <span>Service options</span>
          <span className="drop-arrow">⌃</span>
          {activeFilter === 'service_options' && (
            <FilterDropDown

              handleChange={handleChange}
              filterBy={filterBy}
              onSetFilter={onSetFilter}
              filterName={'Service options'}
            />
          )}
        </div>
        <div className="filter-dropdown" onClick={() => onToggleFilter('seller_details')}>
          <span>Seller details</span>
          <span className="drop-arrow">⌃</span>
          {activeFilter === 'seller_details' && (
            <SellerDetailsFilter

              handleChange={handleChange}
              filterBy={filterBy}
              onSetFilter={onSetFilter}

            />
          )}
        </div>
        <div className="filter-dropdown" onClick={() => onToggleFilter('budget')}>
          <span>Budget</span>
          <span className="drop-arrow">⌃</span>
          {activeFilter === 'budget' && (
            <BudgetFilter

              handleChange={handleChange}
            />
          )}
        </div>
        <div className="filter-dropdown" onClick={() => onToggleFilter('delivery_time')}>
          <span>Delivery time</span>
          <span className="drop-arrow">⌃</span>
          {activeFilter === 'delivery_time' && (
            <FilterDropDown

              handleChange={handleChange}
              filterBy={filterBy}
              onSetFilter={onSetFilter}

            />
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <button type="button" className="clear-filters-btn" onClick={handleClear}>
          Clear
        </button>
      )}

      <label className="sort-filter">
        <span className="label-text">Price</span>
        <div className="sort-controls">
          <div className="switch-wrapper">
            <input
              type="checkbox"
              name="sort-toggle"
              checked={isSortOn}
              onChange={(ev) => onToggleSort(ev.target.checked)}
            />
            <span className="slider"></span>
          </div>
          <select
            className="sort-select"
            name="sort"
            value={sortValue}
            onChange={(ev) => onSortDirectionChange(ev.target.value)}
            disabled={!isSortOn}
          >
            <option value="price-asc">Low to high</option>
            <option value="price-desc">High to low</option>
          </select>
        </div>
      </label>



    </section >
  )
}
