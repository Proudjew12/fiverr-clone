import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { httpService } from './http.service.js'

const BASE_URL = 'gig'


export const gigService = {
  query,
  getById,
  save,
  remove,
  getEmptyItem,
  getDefaultFilter,
  buildFilterFromSearchParams
}


async function query(filterBy = {}, options) {
  const gigs = await httpService.get(BASE_URL, filterBy, options)
  return gigs
}

function getById(id, options) {
  return httpService.get(`${BASE_URL}/${id}`, null, options)
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
    topRated: searchParams.get('topRated') === 'true',
    basic: searchParams.get('basic') === 'true',
    level1: searchParams.get('level1') === 'true',
    level2: searchParams.get('level2') === 'true',
  }
}