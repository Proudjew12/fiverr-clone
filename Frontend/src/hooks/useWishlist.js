import { useMemo, useState } from 'react'
import demoData from '@/data/demo-data.json'
import { utilService } from '@/services/util.service'

const WISHLIST_STORAGE_KEY = 'wishlist'

export function useWishlist({ gigId, title, price, videoUrls } = {}) {
  const fallbackThumbs = demoData.fallbackThumbs
  const [isWishlisted, setIsWishlisted] = useState(() =>
    isInWishlist(gigId)
  )

  const previewImg = useMemo(
    () => getWishlistThumb(videoUrls, fallbackThumbs),
    [videoUrls, fallbackThumbs]
  )

  function toggleWishlist() {
    const next = updateWishlist({
      gigId,
      title,
      price,
      previewImg,
    })
    setIsWishlisted(next)
    return next
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

function loadWishlist() {
  return utilService.loadFromStorage(WISHLIST_STORAGE_KEY, [])
}

function isInWishlist(gigId) {
  return loadWishlist().some((item) => item.gigId === gigId)
}

function updateWishlist(item) {
  const list = loadWishlist()
  const exists = list.find((entry) => entry.gigId === item.gigId)
  let next
  if (exists) {
    next = list.filter((entry) => entry.gigId !== item.gigId)
  } else {
    next = [
      {
        ...item,
        id: utilService.makeId(),
        createdAt: Date.now(),
        status: 'saved',
      },
      ...list,
    ]
  }
  utilService.saveToStorage(WISHLIST_STORAGE_KEY, next)
  window.dispatchEvent(new CustomEvent('wishlist-updated'))
  return !exists
}
