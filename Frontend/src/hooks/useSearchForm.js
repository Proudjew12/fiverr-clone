import { useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gigService } from '@/services/leo.service.local.js'
import { utilService } from '@/services/util.service'

export function useSearchForm({ onBeforeNavigate } = {}) {
  const navigate = useNavigate()
  const location = useLocation()
  const longInputRef = useRef(null)
  const shortInputRef = useRef(null)
  const formKey = location.pathname

  const onSubmit = useCallback(
    (ev) => {
      ev.preventDefault()
      const raw =
        longInputRef.current?.value || shortInputRef.current?.value || ''
      const trimmed = raw.trim()
      if (!trimmed) return
      if (onBeforeNavigate) onBeforeNavigate()
      const filterBy = gigService.getDefaultFilter()
      filterBy.txt = trimmed
      const queryStr = utilService.buildQueryParams(filterBy)
      navigate(`/index?${queryStr}`)
    },
    [navigate, onBeforeNavigate]
  )

  return {
    longInputRef,
    shortInputRef,
    formKey,
    onSubmit,
  }
}
