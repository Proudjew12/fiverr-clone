import { useEffect, useState } from 'react'
import { utilService } from '@/services/util.service.js'
import { orderService } from '@/services/order.service.remote.js'

const ORDERS_STORAGE_KEY = 'orders'
const WISHLIST_STORAGE_KEY = 'wishlist'

export function useDashboardLists() {
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState(() => loadWishlist())

  useEffect(() => {
    async function load() {
    const orders = await loadOrders()
    setOrders(orders)
  }
  load()
    function updateOrders() {
    //  setOrders(()=>await loadOrders())
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
  
  return orderService.query()
}

function loadWishlist() {
  return utilService.loadFromStorage(WISHLIST_STORAGE_KEY, [])
}
