import { useEffect, useRef, useState, useCallback } from 'react'

export function useDropdown() {
  const [openDd, setOpenDd] = useState(null) // 'pro' | 'explore' | null
  const rootRef = useRef(null)

  const toggleDd = useCallback((name) => {
    setOpenDd((prev) => (prev === name ? null : name))
  }, [])

  const closeDd = useCallback(() => {
    setOpenDd(null)
  }, [])

  function isClickInsideAnyDialog(target) {
    if (!(target instanceof Element)) return false

    // Radix Dialog patterns (covers most setups)
    return (
      !!target.closest('[data-radix-portal]') ||
      !!target.closest('[role="dialog"]') ||
      !!target.closest('[data-state="open"][data-radix-dialog-content]')
    )
  }

  useEffect(() => {
    function onDocMouseDown(ev) {
      const rootEl = rootRef.current
      if (!rootEl) return

      // if click is inside header -> do nothing
      if (rootEl.contains(ev.target)) return

      // if click is inside an open dialog portal -> do nothing
      if (isClickInsideAnyDialog(ev.target)) return

      closeDd()
    }

    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [closeDd])

  useEffect(() => {
    function onKeyDown(ev) {
      if (ev.key === 'Escape') closeDd()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeDd])

  return { openDd, toggleDd, closeDd, rootRef }
}
