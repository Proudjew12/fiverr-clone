import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel } from 'swiper/modules'
import { useNavigate } from 'react-router-dom'
import { useSwiperNav } from '@/hooks/useSwiperNav'
import { SvgIcon } from '@/components/svg/SvgIconBackupEran'
import { gigService } from '@/services/leo.service.local.js'
import { utilService } from '@/services/util.service'

const CATEGORIES = [
  { key: 'trending', label: 'Trending 🔥', tag: 'trending' },
  { key: 'graphics', label: 'Graphics & Design', tag: 'graphics' },
  { key: 'tech', label: 'Programming & Tech', tag: 'programming' },
  { key: 'marketing', label: 'Digital Marketing', tag: 'marketing' },
  { key: 'video', label: 'Video & Animation', tag: 'video editing' },
  { key: 'writing', label: 'Writing & Translation', tag: 'writing' },
  { key: 'music', label: 'Music & Audio', tag: 'music' },
  { key: 'business', label: 'Business', tag: 'business' },
  { key: 'finance', label: 'Finance', tag: 'finance' },
  { key: 'ai', label: 'AI Services', tag: 'ai' },
  { key: 'lifestyle', label: 'Personal Growth', tag: 'personal growth' },
  { key: 'consulting', label: 'Consulting', tag: 'consulting' },
  { key: 'data', label: 'Data', tag: 'data' },
  { key: 'photo', label: 'Photography', tag: 'photography' },
]

export function SubHeader() {
  const { onSwiper, onSlideChange, slidePrev, slideNext, isBeginning, isEnd } =
    useSwiperNav()
  const navigate = useNavigate()

  function onCategoryClick(item) {
    const filterBy = gigService.getDefaultFilter()
    if (item?.tag) filterBy.tags = [item.tag]
    const queryStr = utilService.buildQueryParams(filterBy)
    navigate(`/index?${queryStr}`)
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
              <button
                type="button"
                className="sub-header-link"
                onClick={() => onCategoryClick(item)}
              >
                {item.label}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
