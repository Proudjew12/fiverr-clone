import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import demoData from '@/data/demo-data.json'
import gGigs from '../../data/gig.json'

const STORAGE_KEY = 'gig_db'

createGigs()

export const gigService = {
  query,
  queryDemo,
  getById,
  getDemoGigById,
  save,
  remove,
  getEmptyGig,
  getDefaultFilter,
  createGigs,
  filterGigs,
  buildFilterFromSearchParams,
}

let gDemoGigs = null

async function query(filterBy = {}) {
  let gigs = await storageService.query(STORAGE_KEY)

  gigs = filterGigs(gigs, filterBy)

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

async function queryDemo(filterBy = {}) {
  const gigs = await _getDemoGigs()
  return filterGigs(gigs, filterBy)
}

async function getDemoGigById(gigId) {
  const gigs = await _getDemoGigs()
  return gigs.find((gig) => gig._id === gigId) || null
}

function filterGigs(gigs = [], filterBy = {}) {
  let filtered = [...gigs]

  const txt = String(filterBy.txt || '').trim().toLowerCase()
  const tags = _normalizeTags(filterBy.tags)
  const minPrice = _toNumberOrNull(filterBy.minPrice)
  const maxPrice = _toNumberOrNull(filterBy.maxPrice)
  const levelsToFilter = _getLevelsFilter(filterBy)

  if (levelsToFilter.length) {
    filtered = filtered.filter((gig) =>
      levelsToFilter.includes(String(gig.owner?.level || '').toLowerCase())
    )
  }

  if (txt) {
    filtered = filtered.filter((gig) => {
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
    filtered = filtered.filter((gig) =>
      tags.some((tag) => (gig.tags || []).includes(tag))
    )
  }

  if (minPrice !== null) {
    filtered = filtered.filter((gig) => {
      const price = gig.price || 0
      return price >= minPrice
    })
  }

  if (maxPrice !== null) {
    filtered = filtered.filter((gig) => {
      const price = gig.price || 0
      return price <= maxPrice
    })
  }

  if (filterBy.sort === 'price-asc') {
    filtered = filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
  }
  if (filterBy.sort === 'price-desc') {
    filtered = filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
  }

  return filtered
}

function buildFilterFromSearchParams(searchParams) {
  return {
    txt: searchParams.get('txt') || searchParams.get('q') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
    tags: searchParams.getAll('tags') || [],
    topRated: searchParams.get('topRated') === 'true',
    basic: searchParams.get('basic') === 'true',
    level1: searchParams.get('level1') === 'true',
    level2: searchParams.get('level2') === 'true',
  }
}

async function _getDemoGigs() {
  if (gDemoGigs) return gDemoGigs
  const base = await storageService.query(STORAGE_KEY)
  gDemoGigs = buildDemoGigs(base, demoData.randomGig.videos || [])
  return gDemoGigs
}

function buildDemoGigs(source = [], demoVideos = []) {
  if (!source.length) return []
  if (!demoVideos.length) return source

  const categories = demoData.subHeader.categories || []
  return demoVideos.map((videoSrc, idx) => {
    const base = source[idx % source.length]
    const owner = base.owner || {}
    const fullname = utilService.pickRandom(demoData.randomGig.fullnames)
    const rate = Math.round((Math.random() * (5 - 3.8) + 3.8) * 10) / 10
    const price = utilService.getRandomIntInclusive(20, 500)
    const title = utilService.pickRandom(demoData.randomGig.titles)
    const category = categories[idx % categories.length]
    const tag = category?.tag
    return {
      ...base,
      _id: `${base._id}-demo-${idx + 1}`,
      title,
      owner: {
        ...owner,
        fullname,
        rate,
      },
      price,
      tags: tag ? [tag] : base.tags || [],
      videoUrls: [videoSrc],
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
