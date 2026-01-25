import { useEffect, useState } from 'react'
import { SellerDetailsFilter } from './SellerDetailsFilter.jsx'
import { useSearchParams } from 'react-router-dom'
import { BudgetFilter } from './BudgetFilter.jsx'
import { gigService } from '@/services/leo.service.local.js'



export function GigFilter({ filterBy, onSetFilter }) {
  const [activeFilter, setActiveFilter] = useState(null)
  const [searchParams] = useSearchParams()


  useEffect(() => {
  }, [searchParams])

  function onToggleFilter(filterName) {
    setActiveFilter((prevFilter) => (prevFilter === filterName ? null : filterName))
  }

  function handleChange({ target }) {
    let { value, name: field, type, checked } = target

    value = type === 'checkbox' ? checked : type === 'number' ? +value : value


    onSetFilter({ ...filterBy, [field]: value })
    setActiveFilter(null)
  }

  const sortValue = searchParams.get('sort') || ''
  const isSortOn = sortValue === 'price-asc' || sortValue === 'price-desc'

  function onToggleSort(ev) {
    const checked = ev.target.checked
    const nextSort = checked ? sortValue || 'price-asc' : ''
    onSetFilter({ ...filterBy, sort: nextSort })
  }

  function onSortDirectionChange(ev) {
    onSetFilter({ ...filterBy, sort: ev.target.value })
  }

  function onClearFilters() {
    onSetFilter({
      ...gigService.getDefaultFilter(),
      sort: false,
    })
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
        <button type="button" className="clear-filters-btn" onClick={onClearFilters}>
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
              onChange={onToggleSort}
            />
            <span className="slider"></span>
          </div>
          <select
            className="sort-select"
            name="sort"
            value={sortValue}
            onChange={onSortDirectionChange}
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
