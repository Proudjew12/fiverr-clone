import { orderService } from "./order.service.js";
import { loggerService } from "../../services/logger.service.js";

export async function getOrders(req,res) {
 try {
    const orders = await orderService.query()
    res.json(orders)
 } catch (error) {
    loggerService.error('Failed to get orders',error)
    res.status(500).send({ error: 'Failed to get orders' })
 }   
}
export async function getOrderById(req,res) {
try {
  const {id} = req.params
  const order = await orderService.getById(id)  
  res.json(order)
} catch (error) {
  loggerService.info('Failed to find an order with id:',id,error)  
  res.status(error.status || 500).send('Failed to find an order with id:',id)
}    
}
export async function addOrder(req,res) {
    try {
        const saved = await orderService.add(req.body)
        res.status(201).json(saved)
      } catch (err) {
        loggerService.error('Failed to add order', err)
        res.status(err.status || 500).send({ error: err.message || 'Failed to add order' })
      }
}
export async function removeOrder(req,res) {
  try {
     const { id } = req.params
     await orderService.remove(id)
     res.send({ ok: true })
   } catch (err) {
     loggerService.error('Failed to remove order', err)
     res.status(err.status || 500).send({ error: err.message || 'Failed to remove order' })
   }   
}
export async function updateOrder(req,res) {
try {
    const { id } = req.params
    const saved = await orderService.update({ ...req.body, _id: id })
    res.json(saved)
  } catch (err) {
    loggerService.error('Failed to update order', err)
    res.status(err.status || 500).send({ error: err.message || 'Failed to update order' })
  }    
}
