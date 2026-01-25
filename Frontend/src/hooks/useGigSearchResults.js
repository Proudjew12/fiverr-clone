import { useEffect, useMemo, useState } from 'react'
import { gigService } from '@/services/leo.service.local.js'
import { utilService } from '@/services/util.service'
import demoData from '@/data/demo-data.json'

export function useGigSearchResults({ filterBy, pageSize = 8 } = {}) {
  const [gigs, setGigs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let isMounted = true

    async function loadGigs() {
      try {
        setIsLoading(true)
        const data = await gigService.query({})
        const demoGigs = buildDemoGigs(data, demoData.randomGig.videos)
        const filteredGigs = gigService.filterGigs(demoGigs, filterBy)
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

function buildDemoGigs(source = [], demoVideos = []) {
  if (!source.length) return []
  if (!demoVideos.length) return source

  const categories = demoData.subHeader.categories || []
  return demoVideos.map((videoSrc, idx) => {
    const base = source[idx % source.length]
    const owner = base.owner || {}
    const fullname = utilService.pickRandom(demoData.randomGig.fullnames)
    const rate = Math.round((Math.random() * (5 - 3.8) + 3.8) * 10) / 10
    const price = utilService.getRandomIntInclusive(20, 500)
    const title = utilService.pickRandom(demoData.randomGig.titles)
    const category = categories[idx % categories.length]
    const tag = category?.tag
    return {
      ...base,
      _id: `${base._id}-demo-${idx + 1}`,
      title,
      owner: {
        ...owner,
        fullname,
        rate,
      },
      price,
      tags: tag ? [tag] : base.tags || [],
      videoUrls: [videoSrc],
    }
  })
}
