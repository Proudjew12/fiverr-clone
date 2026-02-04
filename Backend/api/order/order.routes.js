import express from 'express'

import {
getOrders,
getOrderById,
addOrder,
updateOrder,
removeOrder,
clearOrders
} from './order.controller.js'

export const orderRoutes = express.Router()

orderRoutes.get('/', getOrders)
orderRoutes.get('/:id', getOrderById)
orderRoutes.post('/', addOrder)
orderRoutes.put('/:id', updateOrder)
orderRoutes.delete('/', clearOrders)
orderRoutes.delete('/:id', removeOrder)
