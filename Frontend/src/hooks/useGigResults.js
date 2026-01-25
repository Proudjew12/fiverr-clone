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
        if (isMounted) setGigs(data)
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
