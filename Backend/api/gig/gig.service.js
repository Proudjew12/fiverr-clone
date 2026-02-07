import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

const COLLECTION_NAME = 'gig'

export const gigService = {
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
    var sort = {}
    if(filterBy.sort){
    sort = (filterBy.sort === 'price-asc')?{price:1}:{price:-1}
    }
    const gigs = await collection.find(criteria).sort(sort).toArray()
    return gigs
    
  } catch (err) {
    loggerService.error('Cannot query gigs', err)
    throw err
  }
}

async function getById(id) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const _id = utilService.toObjectId(id)
    const gig = await collection.findOne({ _id })
    if (!gig) {
      const err = new Error('gig not found')
      err.status = 404
      throw err
    }
    return gig
  } catch (err) {
    loggerService.error('Cannot get gig', err)
    throw err
  }
}

async function add(gigToSave) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)

    const gig = _sanitizegig(gigToSave)
    gig.createdAt = Date.now()
    gig.updatedAt = Date.now()

    const res = await collection.insertOne(gig)
    return { ...gig, _id: res.insertedId }
  } catch (err) {
    loggerService.error('Cannot add gig', err)
    throw err
  }
}

async function update(gigToSave) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)

    if (!gigToSave?._id) {
      const err = new Error('Missing _id')
      err.status = 400
      throw err
    }

    const _id = utilService.toObjectId(gigToSave._id)

    const gig = _sanitizegig(gigToSave)
    delete gig._id
    gig.updatedAt = Date.now()

    const res = await collection.updateOne({ _id }, { $set: gig })
    if (!res.matchedCount) {
      const err = new Error('gig not found')
      err.status = 404
      throw err
    }

    return { ...gigToSave, ...gig, _id }
  } catch (err) {
    loggerService.error('Cannot update gig', err)
    throw err
  }
}

async function remove(id) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const _id = utilService.toObjectId(id)

    const res = await collection.deleteOne({ _id })
    if (!res.deletedCount) {
      const err = new Error('gig not found')
      err.status = 404
      throw err
    }
  } catch (err) {
    loggerService.error('Cannot remove gig', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}

  const txt = String(filterBy.txt || '').trim()
  if (txt) criteria.title = { $regex: txt, $options: 'i' }
  const tags = Array.isArray(filterBy.tags) ? filterBy.tags.filter(Boolean) : []

  if (tags.length) criteria.tags = { $in: tags } // OR logic

  const minPrice = filterBy.minPrice
  const maxPrice = filterBy.maxPrice
  const {topRated,level1,level2,basic} = filterBy
  if (minPrice !== null || maxPrice !== null) {
    criteria.price = {}
    if (minPrice !== null) criteria.price.$gte = Number(minPrice)
      if (maxPrice !== null) criteria.price.$lte = Number(maxPrice)
      
  }
  const levels = []
    if(topRated) levels.push('top rated')
    if(level1) levels.push('1')
    if(level2) levels.push('2')
    if(basic) levels.push('basic')
      
    if(levels.length>0) criteria['owner.level'] = { $in: levels }
    
  return criteria
}

function _sanitizegig(src) {
  return {
    title: String(src?.title || '').trim(),
    description: String(src?.description || '').trim(),
    descriptionHtml: String(src?.descriptionHtml || '').trim(),
    price: Number(src?.price || 0),
    tags: Array.isArray(src?.tags) ? src.tags.filter(Boolean) : [],
    imgUrl: String(src?.imgUrl || '').trim(),
    imgUrls: Array.isArray(src?.imgUrls) ? src.imgUrls.filter(Boolean) : [],
    videoUrls: Array.isArray(src?.videoUrls) ? src.videoUrls.filter(Boolean) : [],
    daysToMake: Number(src?.daysToMake || 0),
    avgResponseTime: Number(src?.avgResponseTime || 0),
    loc: String(src?.loc || '').trim(),
    owner: {
      _id: String(src?.owner?._id || '').trim(),
      fullname: String(src?.owner?.fullname || '').trim(),
      imgUrl: String(src?.owner?.imgUrl || '').trim(),
      level: String(src?.owner?.level || '').trim(),
      rate: Number(src?.owner?.rate || 0),
    },
    reviews: Array.isArray(src?.reviews) ? src.reviews : [],
    likedByUsers: Array.isArray(src?.likedByUsers) ? src.likedByUsers : [],
  }
}
