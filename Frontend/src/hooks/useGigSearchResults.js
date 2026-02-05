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

  const { firstPageGigs, remainingGigs } = useMemo(
    () => buildFeaturedPages(gigs, firstPageSize, 4),
    [gigs, firstPageSize]
  )

  const totalPages = useMemo(() => {
    if (!remainingGigs.length) return 1
    return 1 + Math.ceil(remainingGigs.length / pageSize)
  }, [remainingGigs.length, pageSize])
  const currentPage = Math.min(page, totalPages)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const paginatedGigs = useMemo(() => {
    if (currentPage === 1) return firstPageGigs
    const startIdx = (currentPage - 2) * pageSize
    return remainingGigs.slice(startIdx, startIdx + pageSize)
  }, [currentPage, firstPageGigs, remainingGigs, pageSize])

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

function buildFeaturedPages(gigs = [], firstPageSize, maxFeatured = 4) {
  if (!Array.isArray(gigs) || !gigs.length) {
    return { firstPageGigs: [], remainingGigs: [] }
  }
  const topRated = []
  const others = []
  for (const gig of gigs) {
    const level = String(gig?.owner?.level || '').toLowerCase()
    if (level === 'top rated') topRated.push(gig)
    else others.push(gig)
  }
  topRated.sort((a, b) => (b?.createdAt || 0) - (a?.createdAt || 0))
  if (!topRated.length) {
    return {
      firstPageGigs: gigs.slice(0, firstPageSize),
      remainingGigs: gigs.slice(firstPageSize),
    }
  }
  const featured = topRated.slice(0, maxFeatured)
  const needed = Math.max(firstPageSize - featured.length, 0)
  const firstPageGigs = [...featured, ...others.slice(0, needed)]
  const remainingGigs = [...others.slice(needed), ...topRated.slice(maxFeatured)]
  return { firstPageGigs, remainingGigs }
}
