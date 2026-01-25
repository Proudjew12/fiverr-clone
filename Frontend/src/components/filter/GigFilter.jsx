import { useState } from 'react'
import { SellerDetailsFilter } from './SellerDetailsFilter.jsx'
import { BudgetFilter } from './BudgetFilter.jsx'

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
  const [activeFilter, setActiveFilter] = useState(null)

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
        <button type="button" className="clear-filters-btn" onClick={handleClear}>
          Clear
        </button>
      </div>

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
