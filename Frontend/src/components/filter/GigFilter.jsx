import { useEffect, useMemo, useRef, useState } from 'react'
import { SellerDetailsFilter } from './SellerDetailsFilter.jsx'
import { BudgetFilter } from './BudgetFilter.jsx'
import { gigService } from '@/services/gig.service.remote.js'

const SERVICE_OPTIONS = [
  { label: 'Web Builder', value: 'web-builder' },
  { label: 'Ad & Social', value: 'ad-social' },
  { label: 'Video Editing', value: 'video-editing' },
  { label: 'Shopify', value: 'shopify' },
]

const DELIVERY_OPTIONS = [
  { label: '24 Hours', value: '24h' },
  { label: '3 Days', value: '3d' },
  { label: '7 Days', value: '7d' },
]

export function GigFilter({
  filterBy,
  onSetFilter,
  onFieldChange,
  sortValue,
  isSortOn,
  onToggleSort,
  onSortDirectionChange,
  onClearFilters,
  tagCounts,
  sellerCounts,
}) {
  const defaultFilter = useMemo(() => gigService.getDefaultFilter(), [])
  const [activeFilter, setActiveFilter] = useState(null)
  const filterRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(ev) {
      if (!filterRef.current) return
      if (!filterRef.current.contains(ev.target)) {
        setActiveFilter(null)
      }
    }

    function handleEscape(ev) {
      if (ev.key === 'Escape') setActiveFilter(null)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

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
    <section ref={filterRef} className="gig-filter ">
      <div className="dropdown">
        <div
          className="filter-dropdown"
          onClick={() => onToggleFilter('service_options')}
        >
          <span>Service options</span>
          <span className="drop-arrow">⌃</span>
          {activeFilter === 'service_options' && (
            <FilterDropDown
              title="Service options"
              field="tags"
              options={SERVICE_OPTIONS}
              filterBy={filterBy}
              onSetFilter={onSetFilter}
              counts={tagCounts}
              className="dropdown-container--service"
            />
          )}
        </div>
        <div className="filter-dropdown" onClick={() => onToggleFilter('seller_details')}>
          <span>Seller details</span>
          <span className="drop-arrow">⌃</span>
          {activeFilter === 'seller_details' && (
            <SellerDetailsFilter handleChange={handleChange} counts={sellerCounts} />
          )}
        </div>
        <div className="filter-dropdown" onClick={() => onToggleFilter('budget')}>
          <span>Budget</span>
          <span className="drop-arrow">⌃</span>
          {activeFilter === 'budget' && <BudgetFilter handleChange={handleChange} />}
        </div>
        <div className="filter-dropdown" onClick={() => onToggleFilter('delivery_time')}>
          <span>Delivery time</span>
          <span className="drop-arrow">⌃</span>
          {activeFilter === 'delivery_time' && (
            <FilterDropDown
              title="Delivery time"
              field="deliveryTime"
              options={DELIVERY_OPTIONS}
              filterBy={filterBy}
              onSetFilter={onSetFilter}
              className="dropdown-container--delivery"
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
    </section>
  )
}

function FilterDropDown({ field, options, filterBy, onSetFilter, counts, className }) {
  const fieldValue = filterBy?.[field]
  const isArrayField = Array.isArray(fieldValue)
  const selectedValues = new Set(
    isArrayField ? fieldValue : fieldValue ? [fieldValue] : []
  )

  function onToggleValue(value) {
    if (isArrayField) {
      const nextValues = new Set(selectedValues)
      if (nextValues.has(value)) nextValues.delete(value)
      else nextValues.add(value)
      onSetFilter({ ...filterBy, [field]: Array.from(nextValues) })
      return
    }

    const nextValue = selectedValues.has(value) ? '' : value
    onSetFilter({ ...filterBy, [field]: nextValue })
  }

  return (
    <div
      className={`dropdown-container ${className || ''}`}
      onClick={(ev) => ev.stopPropagation()}
    >
      <div className="checks-container">
        {options.map((option) => (
          <label key={option.value} className="check-filter">
            <input
              type="checkbox"
              checked={selectedValues.has(option.value)}
              onChange={() => onToggleValue(option.value)}
            />
            <span className="check-text">
              <span className="check-label">{option.label}</span>
              {counts && (
                <span className="filter-count">({counts[option.value] || 0})</span>
              )}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
