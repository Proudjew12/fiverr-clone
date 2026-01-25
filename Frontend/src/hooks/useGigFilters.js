import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { gigService } from '@/services/leo.service.local.js'

export function useGigFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filterBy = useMemo(
    () => gigService.buildFilterFromSearchParams(searchParams),
    [searchParams]
  )

  const setFilter = useCallback(
    (filterUpdate) => {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams)

        for (const field in filterUpdate) {
          const value = filterUpdate[field]

          if (value === '' || value === null || value === undefined || value === false) {
            newParams.delete(field)
          } else if (Array.isArray(value)) {
            newParams.delete(field)
            value.filter(Boolean).forEach((entry) => newParams.append(field, entry))
          } else {
            newParams.set(field, value)
          }
        }

        return newParams
      })
    },
    [setSearchParams]
  )

  const handleFieldChange = useCallback(
    ({ target }) => {
      let { value, name: field, type, checked } = target
      value = type === 'checkbox' ? checked : type === 'number' ? +value : value
      setFilter({ ...filterBy, [field]: value })
    },
    [filterBy, setFilter]
  )

  const sortValue = searchParams.get('sort') || ''
  const isSortOn = sortValue === 'price-asc' || sortValue === 'price-desc'

  const toggleSort = useCallback(
    (checked) => {
      const nextSort = checked ? sortValue || 'price-asc' : ''
      setFilter({ ...filterBy, sort: nextSort })
    },
    [filterBy, setFilter, sortValue]
  )

  const setSortDirection = useCallback(
    (nextSort) => {
      setFilter({ ...filterBy, sort: nextSort })
    },
    [filterBy, setFilter]
  )

  const clearFilters = useCallback(() => {
    setFilter({
      ...gigService.getDefaultFilter(),
      sort: false,
    })
  }, [setFilter])

  return {
    filterBy,
    setFilter,
    handleFieldChange,
    sortValue,
    isSortOn,
    toggleSort,
    setSortDirection,
    clearFilters,
  }
}
