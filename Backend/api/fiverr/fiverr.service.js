import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

const COLLECTION_NAME = 'fiverr'

export const fiverrService = {
  query,
  getById,
  add,
  update,
  remove,
}

async function query(filterBy = {}) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const criteria = _buildCriteria(filterBy)
    return await collection.find(criteria).toArray()
  } catch (err) {
    loggerService.error('Cannot query fiverrs', err)
    throw err
  }
}

async function getById(id) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const _id = utilService.toObjectId(id)
    const fiverr = await collection.findOne({ _id })
    if (!fiverr) {
      const err = new Error('Fiverr not found')
      err.status = 404
      throw err
    }
    return fiverr
  } catch (err) {
    loggerService.error('Cannot get fiverr', err)
    throw err
  }
}

async function add(fiverrToSave) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)

    const fiverr = _sanitizeFiverr(fiverrToSave)
    fiverr.createdAt = Date.now()
    fiverr.updatedAt = Date.now()

    const res = await collection.insertOne(fiverr)
    return { ...fiverr, _id: res.insertedId }
  } catch (err) {
    loggerService.error('Cannot add fiverr', err)
    throw err
  }
}

async function update(fiverrToSave) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)

    if (!fiverrToSave?._id) {
      const err = new Error('Missing _id')
      err.status = 400
      throw err
    }

    const _id = utilService.toObjectId(fiverrToSave._id)

    const fiverr = _sanitizeFiverr(fiverrToSave)
    delete fiverr._id
    fiverr.updatedAt = Date.now()

    const res = await collection.updateOne({ _id }, { $set: fiverr })
    if (!res.matchedCount) {
      const err = new Error('Fiverr not found')
      err.status = 404
      throw err
    }

    return { ...fiverrToSave, ...fiverr, _id }
  } catch (err) {
    loggerService.error('Cannot update fiverr', err)
    throw err
  }
}

async function remove(id) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const _id = utilService.toObjectId(id)

    const res = await collection.deleteOne({ _id })
    if (!res.deletedCount) {
      const err = new Error('Fiverr not found')
      err.status = 404
      throw err
    }
  } catch (err) {
    loggerService.error('Cannot remove fiverr', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}

  const txt = String(filterBy.txt || '').trim()
  if (txt) criteria.title = { $regex: txt, $options: 'i' }

  const tags = Array.isArray(filterBy.tags) ? filterBy.tags.filter(Boolean) : []
  if (tags.length) criteria.tags = { $all: tags } // AND logic

  const minPrice = filterBy.minPrice
  const maxPrice = filterBy.maxPrice
  if (minPrice !== null || maxPrice !== null) {
    criteria.price = {}
    if (minPrice !== null) criteria.price.$gte = Number(minPrice)
      if (maxPrice !== null) criteria.price.$lte = Number(maxPrice)
  }

  return criteria
}

function _sanitizeFiverr(src) {
  return {
    title: String(src?.title || '').trim(),
    description: String(src?.description || '').trim(),
    price: Number(src?.price || 0),
    tags: Array.isArray(src?.tags) ? src.tags.filter(Boolean) : [],
    imgUrl: String(src?.imgUrl || '').trim(),
  }
}
