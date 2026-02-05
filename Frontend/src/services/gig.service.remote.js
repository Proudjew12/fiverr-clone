import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { httpService } from './http.service.js'
import demoData from '@/data/demo-data.json'
import gigData from '../../data/gig.json'

const BASE_URL = 'gig'


export const gigService = {
  query,
  getById,
  getDemoGigById,
  save,
  remove,
  getEmptyItem,
  getDefaultFilter,
  buildFilterFromSearchParams,
  buildSearchParamsFromFilter,
}

export const categories = demoData.home.categories

export const categoryFilters = {
  programming: { tag: 'web-builder' },
  graphics: { tag: 'shopify' },
  marketing: { tag: 'ad-social' },
  writing: { tag: 'ad-social' },
  video: { tag: 'video-editing' },
  ai: { tag: 'web-builder' },
  music: { tag: 'video-editing' },
  business: { tag: 'shopify' },
  consulting: { tag: 'shopify' },
}


async function query(filterBy = {}, options) {
  const gigs = await httpService.get(BASE_URL, filterBy, options)
  return gigs
}

function getById(id, options) {
  return httpService.get(`${BASE_URL}/${id}`, null, options)
}

function getDemoGigById(gigId) {
  if (!gigId) return null
  const gigs = Array.isArray(gigData) ? gigData : []
  return gigs.find((gig) => gig?._id === gigId) || null
}

function remove(id, options) {
  return httpService.delete(`${BASE_URL}/${id}`, null, options)
}

function save(item, options) {
  const method = item?._id ? 'put' : 'post'
  const endpoint = item?._id ? `${BASE_URL}/${item._id}` : BASE_URL
  return httpService[method](endpoint, item, options)
}

function getEmptyItem() {
  return {
    title: '',
    description: '',
    price: 0,
    tags: [],
    imgUrl: '',
  }
}

function getDefaultFilter() {
  return {
    txt: '',
    tags: [],
    minPrice: null,
    maxPrice: null,
    deliveryTime: '',
    topRated: false,
    basic: false,
    level1: false,
    level2: false,
  }
}
function buildFilterFromSearchParams(searchParams) {
  return {
    txt: searchParams.get('txt') || searchParams.get('q') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
    tags: searchParams.getAll('tags') || [],
    deliveryTime: searchParams.get('deliveryTime') || '',
    topRated: searchParams.get('topRated') === 'true',
    basic: searchParams.get('basic') === 'true',
    level1: searchParams.get('level1') === 'true',
    level2: searchParams.get('level2') === 'true',
  }
}

function buildSearchParamsFromFilter(filterBy = {}) {
  const params = new URLSearchParams()
  const {
    txt,
    tags,
    minPrice,
    maxPrice,
    sort,
    deliveryTime,
    topRated,
    basic,
    level1,
    level2,
  } = filterBy

  if (txt) params.set('txt', txt)
  if (minPrice !== null && minPrice !== undefined && minPrice !== '') {
    params.set('minPrice', minPrice)
  }
  if (maxPrice !== null && maxPrice !== undefined && maxPrice !== '') {
    params.set('maxPrice', maxPrice)
  }
  if (sort) params.set('sort', sort)
  if (deliveryTime) params.set('deliveryTime', deliveryTime)
  if (topRated) params.set('topRated', 'true')
  if (basic) params.set('basic', 'true')
  if (level1) params.set('level1', 'true')
  if (level2) params.set('level2', 'true')

  if (Array.isArray(tags)) {
    tags.filter(Boolean).forEach((tag) => params.append('tags', tag))
  } else if (typeof tags === 'string' && tags) {
    params.append('tags', tags)
  }

  return params
}
