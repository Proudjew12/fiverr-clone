import { useEffect, useMemo, useState } from 'react'
import { gigService } from '@/services/leo.service.local.js'

export function useGigSearchResults({ filterBy, pageSize = 8 } = {}) {
  const [gigs, setGigs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let isMounted = true

    async function loadGigs() {
      try {
        setIsLoading(true)
        const filteredGigs = await gigService.queryDemo(filterBy)
        if (isMounted) setGigs(filteredGigs)
      } catch (err) {
        console.error('err', err)
        if (isMounted) setGigs([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadGigs()

    return () => {
      isMounted = false
    }
  }, [filterBy])

  useEffect(() => {
    setPage(1)
  }, [filterBy])

  const totalPages = Math.max(1, Math.ceil(gigs.length / pageSize))
  const currentPage = Math.min(page, totalPages)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const paginatedGigs = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize
    return gigs.slice(startIdx, startIdx + pageSize)
  }, [gigs, currentPage, pageSize])

  return {
    gigs,
    isLoading,
    page,
    setPage,
    pageSize,
    totalPages,
    currentPage,
    paginatedGigs,
  }
}
