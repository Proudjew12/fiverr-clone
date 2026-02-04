import { useEffect, useMemo, useState } from 'react'
import demoData from '@/data/demo-data.json'
import { utilService } from '@/services/util.service'
import { wishlistService } from '@/services/wishlist.service.remote.js'

export function useWishlist({ gigId, title, price, videoUrls } = {}) {
  const fallbackThumbs = demoData.fallbackThumbs
  const buyerName = localStorage.getItem('userName') || 'Wilson Gray'
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [wishlistId, setWishlistId] = useState(null)

  const previewImg = useMemo(
    () => getWishlistThumb(videoUrls, fallbackThumbs),
    [videoUrls, fallbackThumbs]
  )

  useEffect(() => {
    let isMounted = true
    async function load() {
      if (!gigId) return
      try {
        const items = await wishlistService.query({ buyerName, gigId })
        if (!isMounted) return
        const item = items?.[0]
        setIsWishlisted(!!item)
        setWishlistId(item?._id || null)
      } catch {
        if (!isMounted) return
        setIsWishlisted(false)
        setWishlistId(null)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [buyerName, gigId])

  async function toggleWishlist() {
    if (!gigId) return false
    if (isWishlisted && wishlistId) {
      await wishlistService.remove(wishlistId)
      setIsWishlisted(false)
      setWishlistId(null)
      window.dispatchEvent(new CustomEvent('wishlist-updated'))
      return false
    }

    const saved = await wishlistService.add({
      gigId,
      title,
      price,
      previewImg,
      buyerName,
      status: 'saved',
    })
    setIsWishlisted(true)
    setWishlistId(saved?._id || null)
    window.dispatchEvent(new CustomEvent('wishlist-updated'))
    return true
  }

  return {
    isWishlisted,
    toggleWishlist,
  }
}

function getWishlistThumb(videoUrls = [], fallbackThumbs = []) {
  const src = Array.isArray(videoUrls) ? videoUrls[0] : videoUrls
  if (!src || typeof src !== 'string') return utilService.pickRandom(fallbackThumbs)
  const trimmed = src.trim()
  if (!trimmed) return utilService.pickRandom(fallbackThumbs)
  const ext = trimmed.split('.').pop().toLowerCase()
  if (['mp4', 'webm', 'ogg'].includes(ext)) {
    return utilService.pickRandom(fallbackThumbs)
  }
  return trimmed
}
