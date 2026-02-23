import { useEffect, useMemo, useState } from 'react'

const REQUEST_TIMEOUT_MS = 8000
const RETRY_DELAY_MS = 1500
const READY_HOLD_MS = 600

export function BackendWarmupGate({ children }) {
  const apiBaseUrl = useMemo(getApiBaseUrl, [])
  const shouldWarmup = useMemo(() => {
    if (!import.meta.env.PROD) return false
    if (import.meta.env.VITE_SKIP_BACKEND_WARMUP === 'true') return false
    return /^https?:\/\//i.test(apiBaseUrl)
  }, [apiBaseUrl])

  const [state, setState] = useState(() =>
    shouldWarmup
      ? {
          ready: false,
          percent: 0,
          title: getWarmupTitle(apiBaseUrl),
          detail: 'Starting health check...',
          attempt: 0,
          startedAt: Date.now(),
        }
      : {
          ready: true,
          percent: 100,
          title: '',
          detail: '',
          attempt: 0,
          startedAt: Date.now(),
        }
  )

  useEffect(() => {
    if (!shouldWarmup) return

    let cancelled = false
    let retryTimer = null
    let holdTimer = null
    let currentAbort = null

    const run = async () => {
      let attempt = 0
      const startedAt = Date.now()

      while (!cancelled) {
        attempt += 1

        setState((prev) => ({
          ...prev,
          percent: Math.max(prev.percent, 10),
          attempt,
          startedAt,
          detail:
            attempt === 1
              ? 'Waking backend service on Render...'
              : `Still waking backend (attempt ${attempt})...`,
        }))

        currentAbort = new AbortController()
        const timeoutId = setTimeout(() => currentAbort?.abort(), REQUEST_TIMEOUT_MS)

        try {
          const healthUrl = buildHealthUrl(apiBaseUrl)
          const res = await fetch(healthUrl, {
            method: 'GET',
            cache: 'no-store',
            credentials: 'include',
            signal: currentAbort.signal,
            headers: {
              Accept: 'application/json',
            },
          })

          setState((prev) => ({
            ...prev,
            percent: Math.max(prev.percent, 50),
            detail: 'Backend responded. Verifying health...',
          }))

          let payload = null
          try {
            payload = await res.json()
          } catch {
            payload = null
          }

          if (!res.ok || !payload?.ok) {
            throw new Error(`Health check failed (${res.status || 'unknown'})`)
          }

          const waitedSec = Math.round((Date.now() - startedAt) / 100) / 10
          setState((prev) => ({
            ...prev,
            percent: 100,
            detail: `Enjoy the website. Backend is ready (${waitedSec}s).`,
          }))

          holdTimer = setTimeout(() => {
            if (cancelled) return
            setState((prev) => ({ ...prev, ready: true }))
          }, READY_HOLD_MS)

          clearTimeout(timeoutId)
          return
        } catch (err) {
          const isAbort = err?.name === 'AbortError'
          const waitSec = Math.round((Date.now() - startedAt) / 100) / 10

          if (!cancelled) {
            setState((prev) => ({
              ...prev,
              percent: Math.max(prev.percent, 10),
              detail: isAbort
                ? `Backend is still cold-starting... (${waitSec}s elapsed)`
                : `Waiting for backend... (${waitSec}s elapsed)`,
            }))
          }

          if (cancelled) {
            clearTimeout(timeoutId)
            return
          }

          await new Promise((resolve) => {
            retryTimer = setTimeout(resolve, RETRY_DELAY_MS)
          })
        } finally {
          clearTimeout(timeoutId)
          currentAbort = null
        }
      }
    }

    run()

    return () => {
      cancelled = true
      if (currentAbort) currentAbort.abort()
      if (retryTimer) clearTimeout(retryTimer)
      if (holdTimer) clearTimeout(holdTimer)
    }
  }, [apiBaseUrl, shouldWarmup])

  if (state.ready) return children

  return (
    <div className="backend-warmup-overlay" role="status" aria-live="polite" aria-busy="true">
      <div className="backend-warmup-card">
        <div className="backend-warmup-label">Startup Check</div>
        <h1 className="backend-warmup-title">{state.title}</h1>
        <div className="backend-warmup-percent">{state.percent}%</div>
        <div className="backend-warmup-track" aria-hidden="true">
          <div
            className="backend-warmup-fill"
            style={{ width: `${Math.max(0, Math.min(100, state.percent))}%` }}
          />
        </div>
        <p className="backend-warmup-detail">{state.detail}</p>
        {state.attempt > 0 && (
          <p className="backend-warmup-attempt">Attempt {state.attempt}</p>
        )}
      </div>
    </div>
  )
}

function getApiBaseUrl() {
  const raw =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? '/api/' : 'http://localhost:3030/api/')

  const trimmed = String(raw || '').trim()
  if (!trimmed) return '/api/'
  return trimmed.endsWith('/') ? trimmed : `${trimmed}/`
}

function buildHealthUrl(apiBaseUrl) {
  const cacheBust = `t=${Date.now()}`

  if (/^https?:\/\//i.test(apiBaseUrl)) {
    const url = new URL('health', apiBaseUrl)
    url.searchParams.set('t', String(Date.now()))
    return url.toString()
  }

  const base = apiBaseUrl.replace(/\/+$/, '')
  return `${base}/health?${cacheBust}`
}

function getWarmupTitle(apiBaseUrl) {
  return /onrender\.com/i.test(apiBaseUrl)
    ? 'Backend From Render Is Being Loaded'
    : 'Backend Is Being Loaded'
}
