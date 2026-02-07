import 'swiper/css'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel } from 'swiper/modules'
import { useSwiperNav } from '@/hooks/useSwiperNav'
import { SvgIcon } from '@/components/svg/SvgIcon'
import demoData from '@/data/demo-data.json'
import { useNavigate } from 'react-router-dom'
import { gigService } from '@/services/gig.service.remote.js'

const popularServices = demoData.home.popularServices

export function PopularCarousel() {
  const { onSwiper, onSlideChange, slidePrev, slideNext, isBeginning, isEnd } =
    useSwiperNav()
  const navigate = useNavigate()

  const serviceFilters = {
    'vibe-coding': { tag: 'web-builder' },
    'website-dev': { tag: 'web-builder' },
    'video-editing': { tag: 'video-editing' },
    'software-dev': { tag: 'web-builder' },
    'book-publishing': { tag: 'shopify' },
    'arch-interior': { tag: 'shopify' },
    'logo-design': { tag: 'shopify' },
    'web-design': { tag: 'web-builder' },
  }

  function onCardClick(service) {
    const filter = serviceFilters[service.key] || { txt: service.title.replace(/\n/g, ' ') }
    const base = gigService.getDefaultFilter()
    const filterBy = {
      ...base,
      txt: filter.txt || '',
      tags: filter.tag ? [filter.tag] : [],
    }
    const params = gigService.buildSearchParamsFromFilter(filterBy)
    const search = params.toString()
    navigate(search ? `/index?${search}` : '/index')
  }

  return (
    <section className="popular" aria-label="Popular services">
      <div className="popular-inner">
        <h2 className="popular-title">Popular services</h2>

        <div className="popular-carousel">
          <button
            type="button"
            className={`popular-arrow left grid place-center ${isBeginning ? 'is-hidden' : ''}`}
            aria-label="Scroll left"
            onClick={slidePrev}
          >
            <svg
              className="popular-arrow-icon is-left"
              width="8"
              height="16"
              viewBox="0 0 8 16"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M0.772126 1.19065L0.153407 1.80934C0.00696973 1.95578 0.00696973 2.19322 0.153407 2.33969L5.80025 8L0.153407 13.6603C0.00696973 13.8067 0.00696973 14.0442 0.153407 14.1907L0.772126 14.8094C0.918563 14.9558 1.156 14.9558 1.30247 14.8094L7.84666 8.26519C7.99309 8.11875 7.99309 7.88131 7.84666 7.73484L1.30247 1.19065C1.156 1.04419 0.918563 1.04419 0.772126 1.19065Z" />
            </svg>
          </button>

          <button
            type="button"
            className={`popular-arrow right grid place-center ${isEnd ? 'is-hidden' : ''}`}
            aria-label="Scroll right"
            onClick={slideNext}
          >
            <svg
              className="popular-arrow-icon"
              width="8"
              height="16"
              viewBox="0 0 8 16"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M0.772126 1.19065L0.153407 1.80934C0.00696973 1.95578 0.00696973 2.19322 0.153407 2.33969L5.80025 8L0.153407 13.6603C0.00696973 13.8067 0.00696973 14.0442 0.153407 14.1907L0.772126 14.8094C0.918563 14.9558 1.156 14.9558 1.30247 14.8094L7.84666 8.26519C7.99309 8.11875 7.99309 7.88131 7.84666 7.73484L1.30247 1.19065C1.156 1.04419 0.918563 1.04419 0.772126 1.19065Z" />
            </svg>
          </button>

          <div className="popular-viewport">
            <Swiper
              className="popular-swiper"
              modules={[Mousewheel]}
              onSwiper={onSwiper}
              onSlideChange={onSlideChange}
              slidesPerView="auto"
              spaceBetween={35}
              slidesOffsetAfter={0}
              grabCursor
              mousewheel={{ forceToAxis: true }}
              touchStartPreventDefault={false}
              threshold={4}
              breakpoints={{
                0: {
                  spaceBetween: 12,
                  slidesOffsetAfter: 16,
                },
                431: {
                  spaceBetween: 35,
                  slidesOffsetAfter: 0,
                },
              }}
            >
              {popularServices.map((s) => (
                <SwiperSlide key={s.key} className="popular-slide">
                  <button
                    type="button"
                    className="popular-card flex flex-col justify-between"
                    style={{ background: s.bg }}
                    onClick={() => onCardClick(s)}
                  >
                    <h3 className="popular-card-title">
                      {s.title.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i === 0 && s.title.includes('\n') ? <br /> : null}
                        </React.Fragment>
                      ))}
                    </h3>

                    <div
                      className={`popular-card-media flex flex-col justify-center ${
                        s.icon === 'popularCarousel1' ? 'popular-card-media--framed' : ''
                      }`}
                      aria-hidden="true"
                    >
                      <SvgIcon icon={s.icon} />
                    </div>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  )
}
