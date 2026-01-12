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

  // Use this on dropdown options so clicking them closes the dropdown
  const getOptionProps = useCallback(
    (userProps = {}) => {
      const { onClick, onPointerDown, ...rest } = userProps

      return {
        ...rest,

        // pointerdown happens before click; closing here feels instant and avoids races
        onPointerDown: (ev) => {
          onPointerDown?.(ev)
          if (ev.defaultPrevented) return
          closeDd()
        },

        // keep click too (covers keyboard "Enter" on buttons/links in some setups)
        onClick: (ev) => {
          onClick?.(ev)
          if (ev.defaultPrevented) return
          closeDd()
        },
      }
    },
    [closeDd]
  )

  function isClickInsideAnyDialog(target) {
    if (!(target instanceof Element)) return false

    return (
      !!target.closest('[data-radix-portal]') ||
      !!target.closest('[role="dialog"]') ||
      !!target.closest('[data-state="open"][data-radix-dialog-content]')
    )
  }

  useEffect(() => {
    if (typeof document === 'undefined') return

    function onDocPointerDown(ev) {
      const rootEl = rootRef.current
      if (!rootEl) return

      if (rootEl.contains(ev.target)) return
      if (isClickInsideAnyDialog(ev.target)) return

      closeDd()
    }

    document.addEventListener('pointerdown', onDocPointerDown, true)
    document.addEventListener('touchstart', onDocPointerDown, true)

    return () => {
      document.removeEventListener('pointerdown', onDocPointerDown, true)
      document.removeEventListener('touchstart', onDocPointerDown, true)
    }
  }, [closeDd])

  useEffect(() => {
    if (typeof window === 'undefined') return

    function onKeyDown(ev) {
      if (ev.key === 'Escape') closeDd()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeDd])

  return { openDd, toggleDd, closeDd, rootRef, getOptionProps }
}
