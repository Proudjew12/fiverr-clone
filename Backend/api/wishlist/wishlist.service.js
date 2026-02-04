import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

const COLLECTION_NAME = 'wishlist'

export const wishlistService = {
  query,
  add,
  remove,
  removeMany,
}

async function query(filterBy = {}) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const criteria = _buildCriteria(filterBy)
    return await collection.find(criteria).toArray()
  } catch (err) {
    loggerService.error('Cannot query wishlist', err)
    throw err
  }
}

async function add(itemToSave) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const item = _sanitizeItem(itemToSave)
    item.createdAt = Date.now()
    const res = await collection.insertOne(item)
    return { ...item, _id: res.insertedId }
  } catch (err) {
    loggerService.error('Cannot add wishlist item', err)
    throw err
  }
}

async function remove(id) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const _id = utilService.toObjectId(id)
    const res = await collection.deleteOne({ _id })
    if (!res.deletedCount) {
      const err = new Error('wishlist item not found')
      err.status = 404
      throw err
    }
  } catch (err) {
    loggerService.error('Cannot remove wishlist item', err)
    throw err
  }
}

async function removeMany(filterBy = {}) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const criteria = _buildCriteria(filterBy)
    return await collection.deleteMany(criteria)
  } catch (err) {
    loggerService.error('Cannot clear wishlist', err)
    throw err
  }
}

function _buildCriteria(filterBy = {}) {
  const criteria = {}
  if (filterBy.buyerName) criteria.buyerName = filterBy.buyerName
  if (filterBy.gigId) criteria.gigId = String(filterBy.gigId)
  return criteria
}

function _sanitizeItem(src) {
  return {
    gigId: String(src?.gigId || '').trim(),
    title: String(src?.title || '').trim(),
    price: Number(src?.price || 0),
    previewImg: String(src?.previewImg || '').trim(),
    buyerName: String(src?.buyerName || '').trim(),
    status: String(src?.status || 'saved').trim(),
  }
}
