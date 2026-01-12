import { useEffect, useRef, useState } from 'react'
import { utilService } from '@/services/util.service.js'
import { FilterDropDown } from './FilterDropDown'

export function GigFilter({ filterBy, onSetFilter }) {
  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
  const [activeFilter, setActiveFilter] = useState(null)

  onSetFilter = useRef(utilService.debounce(onSetFilter, 100))

  useEffect(() => {
    onSetFilter.current(filterByToEdit)
  }, [filterByToEdit])

  function onToggleFilter(filterName) {
    setActiveFilter((prevFilter) => {
      if (prevFilter === filterName) return null
      return filterName
    })
  }

  function handleChange({ target }) {
    let { value, name: field, type, checked } = target
    value = type === 'checkbox' ? checked : type === 'number' ? +value : value
    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
  }
  console.log(filterByToEdit)
  return (
    <section className="gig-filter ">
      <div className="filter-dropdown" onClick={() => onToggleFilter('service_options')}>
        <span>Service options</span>
        <span className="drop-arrow">⌃</span>
        {activeFilter === 'service_options' && (
          <FilterDropDown
            filterByToEdit={filterByToEdit}
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
          <FilterDropDown
            filterByToEdit={filterByToEdit}
            handleChange={handleChange}
            filterBy={filterBy}
            onSetFilter={onSetFilter}
            filterName={'Seller details'}
          />
        )}
      </div>
      <div className="filter-dropdown" onClick={() => onToggleFilter('budget')}>
        <span>Budget</span>
        <span className="drop-arrow">⌃</span>
        {activeFilter === 'budget' && (
          <FilterDropDown
            filterByToEdit={filterByToEdit}
            handleChange={handleChange}
            filterBy={filterBy}
            onSetFilter={onSetFilter}
            filterName={'budget'}
          />
        )}
      </div>
      <div className="filter-dropdown" onClick={() => onToggleFilter('delivery_time')}>
        <span>Delivery time</span>
        <span className="drop-arrow">⌃</span>
        {activeFilter === 'delivery_time' && (
          <FilterDropDown
            filterByToEdit={filterByToEdit}
            handleChange={handleChange}
            filterBy={filterBy}
            onSetFilter={onSetFilter}
            filterName={'delivery time'}
          />
        )}
      </div>
    </section>
  )
}
