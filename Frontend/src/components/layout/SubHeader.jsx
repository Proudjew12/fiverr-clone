import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel } from 'swiper/modules'
import { useSwiperNav } from '@/hooks/useSwiperNav'
import { SvgIcon } from '@/components/svg/SvgIconBackupEran'

const CATEGORIES = [
  { key: 'trending', label: 'Trending 🔥' },
  { key: 'graphics', label: 'Graphics & Design' },
  { key: 'tech', label: 'Programming & Tech' },
  { key: 'marketing', label: 'Digital Marketing' },
  { key: 'video', label: 'Video & Animation' },
  { key: 'writing', label: 'Writing & Translation' },
  { key: 'music', label: 'Music & Audio' },
  { key: 'business', label: 'Business' },
  { key: 'finance', label: 'Finance' },
  { key: 'ai', label: 'AI Services' },
  { key: 'lifestyle', label: 'Personal Growth' },
  { key: 'consulting', label: 'Consulting' },
  { key: 'data', label: 'Data' },
  { key: 'photo', label: 'Photography' },
]

export function SubHeader() {
  const { onSwiper, onSlideChange, slidePrev, slideNext, isBeginning, isEnd } =
    useSwiperNav()

  function onCategoryClick(ev) {
    ev.preventDefault()
  }

  return (
    <div className="sub-header">
      <div className="sub-header-inner">
        <button
          type="button"
          className={`sub-header-arrow left ${isBeginning ? 'is-hidden' : ''}`}
          aria-label="Scroll left"
          onClick={slidePrev}
        >
          <SvgIcon icon="chevronLeft" />
        </button>

        <button
          type="button"
          className={`sub-header-arrow right ${isEnd ? 'is-hidden' : ''}`}
          aria-label="Scroll right"
          onClick={slideNext}
        >
          <SvgIcon icon="chevronRight" />
        </button>

        <Swiper
          className="sub-header-swiper"
          modules={[Mousewheel]}
          onSwiper={onSwiper}
          onSlideChange={onSlideChange}
          slidesPerView="auto"
          spaceBetween={18}
          grabCursor
          mousewheel={{ forceToAxis: true }}
        >
          {CATEGORIES.map((item) => (
            <SwiperSlide key={item.key} className="sub-header-slide">
              <button type="button" className="sub-header-link" onClick={onCategoryClick}>
                {item.label}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
