import { useEffect, useMemo, useState } from 'react'
import { gigService } from '@/services/gig.service.remote.js'

export function useGigSearchResults({ filterBy, pageSize = 8, firstPageSize = 16 } = {}) {
  const [gigs, setGigs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let isMounted = true

    async function loadGigs() {
      try {
        setIsLoading(true)
        const filteredGigs = await gigService.query(filterBy)
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

  const totalPages = useMemo(() => {
    if (gigs.length <= firstPageSize) return 1
    return 1 + Math.ceil((gigs.length - firstPageSize) / pageSize)
  }, [gigs.length, firstPageSize, pageSize])
  const currentPage = Math.min(page, totalPages)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const paginatedGigs = useMemo(() => {
    if (currentPage === 1) return gigs.slice(0, firstPageSize)

    const startIdx = firstPageSize + (currentPage - 2) * pageSize
    return gigs.slice(startIdx, startIdx + pageSize)
  }, [gigs, currentPage, firstPageSize, pageSize])

  return {
    gigs,
    isLoading,
    page,
    setPage,
    totalPages,
    currentPage,
    paginatedGigs,
  }
}
