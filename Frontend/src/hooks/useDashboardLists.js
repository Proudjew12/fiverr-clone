import { useEffect, useState } from 'react'
import { orderService } from '@/services/order.service.remote.js'
import { wishlistService } from '@/services/wishlist.service.remote.js'
import {
  SOCKET_EVENT_ORDER_GIG,
  SOCKET_EVENT_REQUEST_UPDATED,
  socketService,
} from '@/services/socket.service.js'

export function useDashboardLists({ buyerName, isSeller } = {}) {
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    let isMounted = true
    if (isSeller) {
      socketService.emit('set-topic', 'seller')
      socketService.on(SOCKET_EVENT_ORDER_GIG, onOrderReceived)
      socketService.on(SOCKET_EVENT_REQUEST_UPDATED, onOrderUpdated)
    }

    function onOrderReceived(order) {
      if (!order?._id) return
      setOrders((prevOrders) => {
        if (prevOrders.some((prevOrder) => prevOrder._id === order._id)) {
          return prevOrders
        }
        return [order, ...prevOrders]
      })
    }

    function onOrderUpdated(updatedOrder) {
      if (!updatedOrder?._id) return
      setOrders((prevOrders) => {
        const exists = prevOrders.some((order) => order._id === updatedOrder._id)
        if (!exists) return [updatedOrder, ...prevOrders]
        return prevOrders.map((order) =>
          order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
        )
      })
    }
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
      socketService.off(SOCKET_EVENT_ORDER_GIG, onOrderReceived)
      socketService.off(SOCKET_EVENT_REQUEST_UPDATED, onOrderUpdated)
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
    setOrders,
    wishlist,
    clearOrders,
    clearWishlist,
  }
}
