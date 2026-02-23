const RAW_API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api/' : 'http://localhost:3030/api/')

const FRONTEND_BASE_URL = normalizeBaseUrl(import.meta.env.BASE_URL || '/')
const API_ORIGIN = getUrlOrigin(RAW_API_URL)
const HAS_CUSTOM_FRONTEND_BASE = FRONTEND_BASE_URL !== '/'

export const mediaUrlService = {
  resolve,
  resolveList,
  normalizeGig,
}

function resolve(url) {
  const value = String(url || '').trim()
  if (!value) return ''
  const optimizedValue = maybePreferWebp(value)

  if (
    /^(https?:)?\/\//i.test(optimizedValue) ||
    /^data:/i.test(optimizedValue) ||
    /^blob:/i.test(optimizedValue)
  ) {
    return optimizedValue
  }

  // Idempotency: if this path was already normalized to the GitHub Pages base, keep it.
  if (HAS_CUSTOM_FRONTEND_BASE && optimizedValue.startsWith(FRONTEND_BASE_URL)) {
    return optimizedValue
  }

  if (optimizedValue.startsWith('/assets/')) {
    return joinUrl(FRONTEND_BASE_URL, optimizedValue.slice(1))
  }

  if (optimizedValue.startsWith('assets/')) {
    return joinUrl(FRONTEND_BASE_URL, optimizedValue)
  }

  if (optimizedValue.startsWith('/')) {
    if (API_ORIGIN) return joinUrl(API_ORIGIN, optimizedValue.slice(1))
    return joinUrl(FRONTEND_BASE_URL, optimizedValue.slice(1))
  }

  return optimizedValue
}

function resolveList(urls) {
  if (!Array.isArray(urls)) return []
  return urls.map(resolve).filter(Boolean)
}

function normalizeGig(gig) {
  if (!gig || typeof gig !== 'object') return gig

  return {
    ...gig,
    imgUrl: resolve(gig.imgUrl),
    imgUrls: resolveList(gig.imgUrls),
    videoUrls: resolveList(gig.videoUrls),
    owner: gig.owner
      ? {
          ...gig.owner,
          imgUrl: resolve(gig.owner.imgUrl),
        }
      : gig.owner,
    reviews: Array.isArray(gig.reviews)
      ? gig.reviews.map((review) => ({
          ...review,
          by: review?.by
            ? {
                ...review.by,
                imgUrl: resolve(review.by.imgUrl),
              }
            : review?.by,
        }))
      : gig.reviews,
  }
}

function normalizeBaseUrl(baseUrl) {
  const raw = String(baseUrl || '/').trim()
  if (!raw || raw === '/') return '/'
  const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

function joinUrl(base, path) {
  const baseValue = String(base || '')
  const pathValue = String(path || '')
  const cleanBase = baseValue.replace(/\/+$/, '')
  const cleanPath = pathValue.replace(/^\/+/, '')
  return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`
}

function getUrlOrigin(url) {
  const value = String(url || '').trim()
  if (!/^https?:\/\//i.test(value)) return ''

  try {
    return new URL(value).origin
  } catch {
    return ''
  }
}

function maybePreferWebp(path) {
  const value = String(path || '')
  const normalizedForCheck =
    HAS_CUSTOM_FRONTEND_BASE && value.startsWith(FRONTEND_BASE_URL)
      ? `/${value.slice(FRONTEND_BASE_URL.length)}`
      : value
  const isOfficialDemoAsset =
    normalizedForCheck.startsWith('/assets/OfficalGigDemoData/') ||
    normalizedForCheck.startsWith('assets/OfficalGigDemoData/')

  if (!isOfficialDemoAsset) return value
  if (!/\.(png|jpe?g)$/i.test(value)) return value

  return value.replace(/\.(png|jpe?g)$/i, '.webp')
}
