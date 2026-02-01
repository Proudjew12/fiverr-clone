import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel } from 'swiper/modules'
import { useNavigate } from 'react-router-dom'
import { useSwiperNav } from '@/hooks/useSwiperNav'
import { SvgIcon } from '@/components/svg/SvgIcon'
import { gigService } from '@/services/gig.service.remote.js'
import { utilService } from '@/services/util.service'
import demoData from '@/data/demo-data.json'

const CATEGORIES = demoData.subHeader.categories

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
