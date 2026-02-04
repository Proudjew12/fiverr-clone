import { useEffect, useState } from 'react'
import { orderService } from '@/services/order.service.remote.js'
import { wishlistService } from '@/services/wishlist.service.remote.js'

export function useDashboardLists({ buyerName, isSeller } = {}) {
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    let isMounted = true

    async function load() {
      const orderParams = isSeller ? {} : buyerName ? { buyerName } : {}
      const orders = await orderService.query(orderParams)
      if (!isMounted) return
      setOrders(orders)

      if (!isSeller) {
        const wishParams = buyerName ? { buyerName } : {}
        const wishlist = await wishlistService.query(wishParams)
        if (!isMounted) return
        setWishlist(wishlist)
      } else {
        setWishlist([])
      }
    }

    function onOrdersUpdated() {
      load()
    }

    function onWishlistUpdated() {
      load()
    }

    load()
    window.addEventListener('orders-updated', onOrdersUpdated)
    window.addEventListener('wishlist-updated', onWishlistUpdated)

    return () => {
      isMounted = false
      window.removeEventListener('orders-updated', onOrdersUpdated)
      window.removeEventListener('wishlist-updated', onWishlistUpdated)
    }
  }, [buyerName, isSeller])

  async function clearOrders() {
    const params = isSeller ? {} : buyerName ? { buyerName } : {}
    await orderService.clear(params)
    setOrders([])
  }

  async function clearWishlist() {
    const params = buyerName ? { buyerName } : {}
    await wishlistService.clear(params)
    setWishlist([])
  }

  return {
    orders,
    wishlist,
    clearOrders,
    clearWishlist,
  }
}
