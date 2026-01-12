import { useCallback, useEffect, useMemo, useState } from 'react'

export function useSwiperNav() {
  const [swiper, setSwiper] = useState(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  const syncEdges = useCallback((sw) => {
    if (!sw) return
    setIsBeginning(Boolean(sw.isBeginning))
    setIsEnd(Boolean(sw.isEnd))
  }, [])

  const onSwiper = useCallback(
    (sw) => {
      setSwiper(sw)
      syncEdges(sw)
    },
    [syncEdges]
  )

  const onSlideChange = useCallback(
    (sw) => {
      syncEdges(sw)
    },
    [syncEdges]
  )

  const slidePrev = useCallback(() => {
    if (!swiper) return
    swiper.slidePrev()
    syncEdges(swiper)
  }, [swiper, syncEdges])

  const slideNext = useCallback(() => {
    if (!swiper) return
    swiper.slideNext()
    syncEdges(swiper)
  }, [swiper, syncEdges])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!swiper) return

    function onKeyDown(ev) {
      const tag = ev.target?.tagName?.toLowerCase()
      const isTyping =
        tag === 'input' || tag === 'textarea' || ev.target?.isContentEditable
      if (isTyping) return

      if (ev.key === 'ArrowLeft') slidePrev()
      if (ev.key === 'ArrowRight') slideNext()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [swiper, slidePrev, slideNext])

  return useMemo(
    () => ({
      onSwiper,
      onSlideChange,
      slidePrev,
      slideNext,
      isBeginning,
      isEnd,
    }),
    [onSwiper, onSlideChange, slidePrev, slideNext, isBeginning, isEnd]
  )
}
