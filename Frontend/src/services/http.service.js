import Axios from 'axios'

const RAW_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api/' : 'http://localhost:3030/api/')

const BASE_URL = normalizeApiBaseUrl(RAW_BASE_URL)

const axios = Axios.create({ withCredentials: true })

export const httpService = {
  get(endpoint, params, options) {
    return request(endpoint, 'GET', null, params, options)
  },
  post(endpoint, data, options) {
    return request(endpoint, 'POST', data, null, options)
  },
  put(endpoint, data, options) {
    return request(endpoint, 'PUT', data, null, options)
  },
  delete(endpoint, data, options) {
    return request(endpoint, 'DELETE', data, null, options)
  },
}

function normalizeApiBaseUrl(url) {
  const trimmed = String(url || '').trim()
  if (!trimmed) return '/api/'
  return trimmed.endsWith('/') ? trimmed : `${trimmed}/`
}

async function request(endpoint, method, data = null, params = null, options = null) {
  try {
    const cleanEndpoint = String(endpoint || '').replace(/^\/+/, '')

    const res = await axios({
      url: `${BASE_URL}${cleanEndpoint}`,
      method,
      params: params || undefined,
      data: method === 'GET' ? undefined : (data ?? undefined),
      signal: options?.signal,
    })

    return res.data
  } catch (err) {
    console.error(`HTTP ${method} failed on ${endpoint}`, {
      params,
      data,
      status: err?.response?.status,
      message: err?.message,
    })

    if (err.response?.status === 401) sessionStorage.clear()
    throw err
  }
}
