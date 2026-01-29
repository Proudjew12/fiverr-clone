import { dbService } from "../../services/db.service.js";
import { loggerService } from "../../services/logger.service.js";
import { utilService } from "../../services/util.service.js";
export const orderService={
  query,
  getById,
  add,
  update,
  remove
}
const COLLECTION_NAME = 'order'
async function query() {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    return await collection.find({}).toArray()
  } catch (err) {
    loggerService.error('Cannot query orders', err)
    throw err
  }
}

async function getById(id) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const _id = utilService.toObjectId(id)
    const order = await collection.findOne({ _id })
    if (!order) {
      const err = new Error('order not found')
      err.status = 404
      throw err
    }
    return order
  } catch (err) {
    loggerService.error('Cannot get order', err)
    throw err
  }
}

async function add(orderToSave) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)

    const order = _sanitizeorder(orderToSave)
    order.createdAt = Date.now()
    order.updatedAt = Date.now()

    const res = await collection.insertOne(order)
    return { ...order, _id: res.insertedId }
  } catch (err) {
    loggerService.error('Cannot add order', err)
    throw err
  }
}

async function update(orderToSave) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)

    if (!orderToSave?._id) {
      const err = new Error('Missing _id')
      err.status = 400
      throw err
    }

    const _id = utilService.toObjectId(orderToSave._id)

    const order = _sanitizeorder(orderToSave)
    delete order._id
    order.updatedAt = Date.now()

    const res = await collection.updateOne({ _id }, { $set: order })
    if (!res.matchedCount) {
      const err = new Error('order not found')
      err.status = 404
      throw err
    }

    return { ...orderToSave, ...order, _id }
  } catch (err) {
    loggerService.error('Cannot update order', err)
    throw err
  }
}

async function remove(id) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const _id = utilService.toObjectId(id)

    const res = await collection.deleteOne({ _id })
    if (!res.deletedCount) {
      const err = new Error('order not found')
      err.status = 404
      throw err
    }
  } catch (err) {
    loggerService.error('Cannot remove order', err)
    throw err
  }
}

function _sanitizeorder(src) {
  return {
    title: String(src?.title || '').trim(),
    description: String(src?.description || '').trim(),
    price: Number(src?.price || 0),
    tags: Array.isArray(src?.tags) ? src.tags.filter(Boolean) : [],
    imgUrl: String(src?.imgUrl || '').trim(),
  }
}