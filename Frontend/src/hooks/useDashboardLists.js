import { useEffect, useState } from 'react'
import { utilService } from '@/services/util.service'

const ORDERS_STORAGE_KEY = 'orders'
const WISHLIST_STORAGE_KEY = 'wishlist'

export function useDashboardLists() {
  const [orders, setOrders] = useState(() => loadOrders())
  const [wishlist, setWishlist] = useState(() => loadWishlist())

  useEffect(() => {
    function updateOrders() {
      setOrders(loadOrders())
    }

    function updateWishlist() {
      setWishlist(loadWishlist())
    }

    window.addEventListener('storage', updateOrders)
    window.addEventListener('orders-updated', updateOrders)
    window.addEventListener('wishlist-updated', updateWishlist)

    return () => {
      window.removeEventListener('storage', updateOrders)
      window.removeEventListener('orders-updated', updateOrders)
      window.removeEventListener('wishlist-updated', updateWishlist)
    }
  }, [])

  function clearOrders() {
    utilService.saveToStorage(ORDERS_STORAGE_KEY, [])
    window.dispatchEvent(new CustomEvent('orders-updated'))
    setOrders([])
  }

  function clearWishlist() {
    utilService.saveToStorage(WISHLIST_STORAGE_KEY, [])
    window.dispatchEvent(new CustomEvent('wishlist-updated'))
    setWishlist([])
  }

  return {
    orders,
    wishlist,
    clearOrders,
    clearWishlist,
  }
}

function loadOrders() {
  return utilService.loadFromStorage(ORDERS_STORAGE_KEY, [])
}

function loadWishlist() {
  return utilService.loadFromStorage(WISHLIST_STORAGE_KEY, [])
}
