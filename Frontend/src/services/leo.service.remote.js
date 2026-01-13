import { httpService } from './http.service'

const BASE_URL = 'fiverr'

export const fiverrService = {
  query,
  getById,
  save,
  remove,
  getEmptyItem,
  getDefaultFilter,
}

async function query(filterBy = {}, options) {
  return httpService.get(BASE_URL, filterBy, options)
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
  }
}
