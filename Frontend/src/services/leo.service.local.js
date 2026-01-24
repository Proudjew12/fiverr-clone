import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import gGigs from '../../data/gig.json'

const STORAGE_KEY = 'gig_db'

createGigs()

export const gigService = {
  query,
  getById,
  save,
  remove,
  getEmptyGig,
  getDefaultFilter,
  createGigs,
}

async function query(filterBy = {}) {
  let gigs = await storageService.query(STORAGE_KEY)

  const txt = String(filterBy.txt || '').trim().toLowerCase()
  const tags = _normalizeTags(filterBy.tags)
  const minPrice = _toNumberOrNull(filterBy.minPrice)
  const maxPrice = _toNumberOrNull(filterBy.maxPrice)
  const levelsToFilter = _getLevelsFilter(filterBy)

  if (levelsToFilter.length) {
    gigs = gigs.filter((gig) =>
      levelsToFilter.includes(String(gig.owner?.level || '').toLowerCase())
    )
  }

  if (filterBy.sort) {
    gigs = gigs.sort((a, b) =>  a.price - b.price)
  }

  if (txt) {
    gigs = gigs.filter((gig) => {
      const haystack = [
        gig.title,
        gig.description,
        gig.owner?.fullname,
        ...(gig.tags || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(txt)
    })
  }

  if (tags.length) {
    gigs = gigs.filter((gig) =>
      tags.every((tag) => (gig.tags || []).includes(tag))
    )
  }

  if (maxPrice) {
    gigs = gigs.filter((gig) => {
      const price = gig.price || 0
      return price <= maxPrice
    })
  }

  return gigs.map(({ _id, title, owner, description, price, videoUrls }) => {
    const safeOwner = owner || getEmptyGig().owner
    const safeVideoUrls = Array.isArray(videoUrls)
      ? videoUrls
      : videoUrls
        ? [videoUrls]
        : []

    return {
      _id,
      title,
      owner: safeOwner,
      description,
      price,
      videoUrls: safeVideoUrls,
    }
  })
}

function getById(gigId) {
  return storageService.get(STORAGE_KEY, gigId)
}

async function remove(gigId) {
  await storageService.remove(STORAGE_KEY, gigId)
}

async function save(gig) {
  const gigToSave = _sanitizeGig(gig)
  if (gigToSave._id) {
    return storageService.put(STORAGE_KEY, gigToSave)
  }
  return storageService.post(STORAGE_KEY, gigToSave)
}

function getEmptyGig() {
  return {
    title: '',
    description: '',
    price: 0,
    tags: [],
    imgUrls: [],
    videoUrls: [],
    owner: {
      _id: utilService.makeId(),
      fullname: 'Guest',
      imgUrl: '',
      level: 'basic',
      rate: 0,
    },
  }
}

function getDefaultFilter() {
  return {
    txt: '',
    tags: [],
    minPrice: null,
    maxPrice: null,
    topRated: false,
    basic: false,
    level1: false,
    level2: false,
  }
}

function createGigs() {
  const gigs = JSON.parse(localStorage.getItem(STORAGE_KEY))
  if (!gigs || !gigs.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gGigs))
  }
}

function _sanitizeGig(src) {
  return {
    _id: src?._id,
    title: String(src?.title || '').trim(),
    description: String(src?.description || '').trim(),
    price: Number(src?.price || 0),
    tags: Array.isArray(src?.tags) ? src.tags.filter(Boolean) : [],
    imgUrls: Array.isArray(src?.imgUrls) ? src.imgUrls.filter(Boolean) : [],
    videoUrls: Array.isArray(src?.videoUrls) ? src.videoUrls.filter(Boolean) : [],
    owner: src?.owner || getEmptyGig().owner,
    reviews: Array.isArray(src?.reviews) ? src.reviews : [],
  }
}

function _getLevelsFilter(filterBy) {
  const levels = []
  if (filterBy.topRated) levels.push('top rated')
  if (filterBy.basic) levels.push('basic')
  if (filterBy.level1) levels.push('1')
  if (filterBy.level2) levels.push('2')
  return levels
}

function _normalizeTags(val) {
  if (!val) return []
  if (Array.isArray(val)) return val.filter(Boolean)
  return String(val)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function _toNumberOrNull(val) {
  if (val === undefined || val === null || val === '') return null
  const n = Number(val)
  return Number.isFinite(n) ? n : null
}
