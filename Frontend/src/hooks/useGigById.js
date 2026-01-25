import { useCallback, useEffect, useState } from 'react'
import { gigService } from '@/services/leo.service.local.js'

export function useGigById(gigId) {
  const [gig, setGig] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadGig = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await gigService.getById(gigId)
      setGig(data)
    } catch (err) {
      console.error('Failed to load gig', err)
    } finally {
      setIsLoading(false)
    }
  }, [gigId])

  useEffect(() => {
    if (gigId) loadGig()
  }, [gigId, loadGig])

  return { gig, isLoading }
}
