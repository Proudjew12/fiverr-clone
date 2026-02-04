import { httpService } from "./http.service.js";

const BASE_URL = 'order'

export const orderService = {
query,
getById,
save,
remove,
clear
}
async function query(params) {
  return httpService.get(BASE_URL, params)
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

function clear(params) {
  return httpService.delete(BASE_URL, params)
}
