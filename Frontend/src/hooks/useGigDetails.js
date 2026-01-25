import { useCallback, useEffect, useState } from 'react'
import { gigService } from '@/services/leo.service.local.js'

export function useGigDetails(gigId) {
  const [gig, setGig] = useState(null)
  const [gigImgs, setGigImgs] = useState([])
  const [index, setIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const loadGig = useCallback(async () => {
    try {
      setIsLoading(true)
      let data
      try {
        data = await gigService.getById(gigId)
      } catch {
        data = await gigService.getDemoGigById(gigId)
      }
      setGig(data)
      setGigImgs([...(data?.videoUrls || []), ...(data?.imgUrls || [])])
    } catch (error) {
      console.log('There is no gig with id:', gigId, error)
    } finally {
      setIsLoading(false)
    }
  }, [gigId])

  useEffect(() => {
    if (gigId) loadGig()
  }, [gigId, loadGig])

  const setImg = useCallback(
    (diff) => {
      setIndex((prev) => {
        if (!gigImgs.length) return 0
        if (prev + diff === gigImgs.length) return 0
        if (prev + diff === -1) return gigImgs.length - 1
        return prev + diff
      })
    },
    [gigImgs.length]
  )

  return {
    gig,
    gigImgs,
    index,
    setIndex,
    setImg,
    isLoading,
  }
}
