import { useEffect, useState } from 'react'
import { gigService } from '@/services/leo.service.local.js'

export function useGigResults(filterBy) {
  const [gigs, setGigs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadResults() {
      try {
        setIsLoading(true)
        const data = await gigService.query(filterBy)
        const prioritized = prioritizeTopRated(data, 4)
        if (isMounted) setGigs(prioritized)
      } catch (err) {
        console.error('Failed to search gigs', err)
        if (isMounted) setGigs([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadResults()

    return () => {
      isMounted = false
    }
  }, [filterBy])

  return { gigs, isLoading }
}

function prioritizeTopRated(gigs = [], maxFeatured = 4) {
  if (!Array.isArray(gigs) || !gigs.length) return []
  const topRated = []
  const others = []
  for (const gig of gigs) {
    const level = String(gig?.owner?.level || '').toLowerCase()
    if (level === 'top rated') topRated.push(gig)
    else others.push(gig)
  }
  if (!topRated.length) return gigs
  const featured = topRated.slice(0, maxFeatured)
  const rest = topRated.slice(maxFeatured)
  return [...featured, ...others, ...rest]
}
