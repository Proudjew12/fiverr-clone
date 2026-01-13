import { useEffect, useRef, useState } from 'react'
import { utilService } from '@/services/util.service.js'
import { FilterDropDown } from './FilterDropDown'
import { useSearchParams } from 'react-router-dom'

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
  }


  return (
    <section className="gig-filter ">
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
          <FilterDropDown
           
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
