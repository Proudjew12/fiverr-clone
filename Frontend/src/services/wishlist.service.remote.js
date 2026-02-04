import { httpService } from './http.service.js'

const BASE_URL = 'wishlist'

export const wishlistService = {
  query,
  add,
  remove,
  clear,
}

function query(params) {
  return httpService.get(BASE_URL, params)
}

function add(item) {
  return httpService.post(BASE_URL, item)
}

function remove(id) {
  return httpService.delete(`${BASE_URL}/${id}`)
}

function clear(params) {
  return httpService.delete(BASE_URL, params)
}
