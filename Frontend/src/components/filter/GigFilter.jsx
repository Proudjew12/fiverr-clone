import { useEffect, useState } from 'react'
import { SellerDetailsFilter } from './SellerDetailsFilter.jsx'
import { useSearchParams } from 'react-router-dom'
import { BudgetFilter } from './BudgetFilter.jsx'



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

      <label className="sort-filter">
        <span className="label-text">Price</span>
        <div className="switch-wrapper">
          <input
            type="checkbox"
            name="sort"
            checked={searchParams.get('sort') === 'true'}
            onChange={handleChange}
          />
          <span className="slider"></span>
        </div>
      </label>



    </section >
  )
}
