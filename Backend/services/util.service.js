// services/util.service.js
import { ObjectId } from 'mongodb'

export const utilService = {
  makeId,
  debounce,
  getRandomIntInclusive,
  pickRandom,
  timeAgo,
  randomPastTime,

  toObjectId,
  normalizeArrayQuery,
  toNumberOrNull,
}

/**
 * Generate a random ID
 */
function makeId(length = 5) {
  const possible =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let txt = ''
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

/**
 * Debounce (mostly useful for scripts / workers)
 */
function debounce(fn, wait = 300) {
  let timerId
  return function debounced(...args) {
    clearTimeout(timerId)
    timerId = setTimeout(() => fn.apply(this, args), wait)
  }
}

/**
 * Random integer (inclusive)
 */
function getRandomIntInclusive(min, max) {
  const _min = Math.ceil(min)
  const _max = Math.floor(max)
  return Math.floor(Math.random() * (_max - _min + 1)) + _min
}

/**
 * Pick random item from array
 */
function pickRandom(items) {
  if (!Array.isArray(items) || !items.length) return null
    return items[getRandomIntInclusive(0, items.length - 1)]
}

/**
 * Human-readable relative time
 * Accepts Date | timestamp | ISO string
 */
function timeAgo(input = Date.now()) {
  const date =
  input instanceof Date
  ? input
  : new Date(typeof input === 'number' ? input : Date.parse(input))

  if (Number.isNaN(date.getTime())) return ''

    const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    const ranges = {
      year: 3600 * 24 * 365,
      month: 3600 * 24 * 30,
      week: 3600 * 24 * 7,
      day: 3600 * 24,
      hour: 3600,
      minute: 60,
      second: 1,
    }

    const secondsElapsed = (date.getTime() - Date.now()) / 1000

    for (const unit in ranges) {
      if (ranges[unit] < Math.abs(secondsElapsed)) {
        const delta = secondsElapsed / ranges[unit]
        return formatter.format(Math.round(delta), unit)
      }
    }

    return 'just now'
}

/**
 * Random past timestamp (1 hour → 1 week ago)
 */
function randomPastTime() {
  const HOUR = 1000 * 60 * 60
  const WEEK = 1000 * 60 * 60 * 24 * 7
  return Date.now() - getRandomIntInclusive(HOUR, WEEK)
}

/**
 * Convert string to Mongo ObjectId with a consistent 400 error.
 */
function toObjectId(id) {
  try {
    return new ObjectId(String(id))
  } catch {
    const err = new Error('Invalid id')
    err.status = 400
    throw err
  }
}

/**
 * Supports:
 * - ?tags=design&tags=logo
 * - ?tags=design,logo
 */
function normalizeArrayQuery(val) {
  if (!val) return []
    if (Array.isArray(val)) return val.filter(Boolean)
      return String(val)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
}

function toNumberOrNull(val) {
  if (val === undefined || val === null || val === '') return null
    const n = Number(val)
    return Number.isFinite(n) ? n : null
}
