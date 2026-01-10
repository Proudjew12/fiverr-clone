

import { useEffect, useRef, useState } from "react"
import { utilService } from "@/services/util.service.js"
import { FilterDropDown } from "./FilterDropdown.jsx"


export function GigFilter({ filterBy, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const [activeFilter, setActiveFilter] = useState(null)
    onSetFilter = useRef(utilService.debounce(onSetFilter, 100))

    useEffect(() => {
        onSetFilter.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        value = type === 'number' ? +value : value
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

   function onToggleFilter(filterName) {
        setActiveFilter(prevFilter => {
            if (prevFilter === filterName) return null
            return filterName
        })
    }

    return (
        <section className="gig-filter ">
            <div className="filter-dropdown" onClick={() => onToggleFilter('service_options')}>
                <span>Service options</span>
                <span className="drop-arrow">⌃</span>
                {activeFilter === 'service_options' && <FilterDropDown filterName={'Service options'} />}
            </div>
            <div className="filter-dropdown" onClick={() => onToggleFilter('seller_details')}>
                <span>Seller details</span>
                <span className="drop-arrow">⌃</span>
                {activeFilter === 'seller_details' && <FilterDropDown filterName={'Seller details'} />}
            </div>
            <div className="filter-dropdown" onClick={() => onToggleFilter('budget')}>
                <span>Budget</span>
                <span className="drop-arrow">⌃</span>
                {activeFilter === 'budget' && <FilterDropDown filterName={'budget'} />}
            </div>
            <div className="filter-dropdown" onClick={() => onToggleFilter('delivery_time')}>
                <span>Delivery time</span>
                <span className="drop-arrow">⌃</span>
                {activeFilter === 'delivery_time' && <FilterDropDown filterName={'delivery time'} />}
            </div>

        </section>
    )
}