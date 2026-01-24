import 'swiper/css'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel } from 'swiper/modules'
import { useSwiperNav } from '@/hooks/useSwiperNav'
import { SvgIcon } from '@/components/svg/SvgIcon'

const popularServices = [
  { key: 'vibe-coding', title: 'Vibe Coding', bg: '#003912', icon: 'popularCarousel1' },
  {
    key: 'website-dev',
    title: 'Website\nDevelopment',
    bg: '#003912',
    icon: 'popularCarousel2',
  },
  {
    key: 'video-editing',
    title: 'Video Editing',
    bg: '#003912',
    icon: 'popularCarousel3',
  },
  {
    key: 'software-dev',
    title: 'Software\nDevelopment',
    bg: '#003912',
    icon: 'popularCarousel4',
  },
  {
    key: 'book-publishing',
    title: 'Book Publishing',
    bg: '#003912',
    icon: 'popularCarousel5',
  },
  {
    key: 'arch-interior',
    title: 'Architecture &\nInterior Design',
    bg: '#003912',
    icon: 'popularCarousel6',
  },
  { key: 'logo-design', title: 'Logo Design', bg: '#003912', icon: 'popularCarousel7' },
  { key: 'web-design', title: 'Website Design', bg: '#003912', icon: 'popularCarousel8' },
]

export function PopularCarousel() {
  const { onSwiper, onSlideChange, slidePrev, slideNext, isBeginning, isEnd } =
    useSwiperNav()

  function onCardClick(ev) {
    ev.preventDefault()
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
            <SvgIcon icon="chevronLeft" />
          </button>

          <button
            type="button"
            className={`popular-arrow right grid place-center ${isEnd ? 'is-hidden' : ''}`}
            aria-label="Scroll right"
            onClick={slideNext}
          >
            <SvgIcon icon="chevronRight" />
          </button>

          <div className="popular-viewport">
            <Swiper
              className="popular-swiper"
              modules={[Mousewheel]}
              onSwiper={onSwiper}
              onSlideChange={onSlideChange}
              slidesPerView="auto"
              spaceBetween={16}
              grabCursor
              mousewheel={{ forceToAxis: true }}
            >
              {popularServices.map((s) => (
                <SwiperSlide key={s.key} className="popular-slide">
                  <button
                    type="button"
                    className="popular-card flex flex-col justify-between"
                    style={{ background: s.bg }}
                    onClick={onCardClick}
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
                      className="popular-card-media flex flex-col justify-center"
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
