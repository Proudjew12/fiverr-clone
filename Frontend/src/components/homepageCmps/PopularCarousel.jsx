import 'swiper/css'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel } from 'swiper/modules'
import { useSwiperNav } from '@/hooks/useSwiperNav'

const popularServices = [
  {
    key: 'vibe-coding',
    title: 'Vibe Coding',
    href: '#',
    img: 'https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/4bcc801c556c499e911d5579c898700d-1750061715400/vibe_coding.png',
    bg: '#003912',
  },
  {
    key: 'website-dev',
    title: 'Website\nDevelopment',
    href: '#',
    img: 'https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/798403f5b92b1b5af997acc704a3d21c-1702465156477/website-development.png',
    bg: '#003912',
  },
  {
    key: 'video-editing',
    title: 'Video Editing',
    href: '#',
    img: 'https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/798403f5b92b1b5af997acc704a3d21c-1702465156494/video-editing.png',
    bg: '#003912',
  },
  {
    key: 'software-dev',
    title: 'Software\nDevelopment',
    href: '#',
    img: 'https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/798403f5b92b1b5af997acc704a3d21c-1702465156476/software-development.png',
    bg: '#003912',
  },
  {
    key: 'book-publishing',
    title: 'Book Publishing',
    href: '#',
    img: 'https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/6dab2e43183c2c233eb78f62f9975d7e-1762279009299/book_publishing.png',
    bg: '#003912',
  },
  {
    key: 'arch-interior',
    title: 'Architecture &\nInterior Design',
    href: '#',
    img: 'https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/798403f5b92b1b5af997acc704a3d21c-1702465156473/architecture-design.png',
    bg: '#003912',
  },
  {
    key: 'logo-design',
    title: 'Logo Design',
    href: '#',
    img: 'https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/798403f5b92b1b5af997acc704a3d21c-1702465156494/logo-design.png',
    bg: '#003912',
  },
  {
    key: 'web-design',
    title: 'Website Design',
    href: '#',
    img: 'https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/9d03d60a4fbbbed75ac139f57819ab74-1745826123751/Website%20Design.png',
    bg: '#003912',
  },
]

function ChevronLeft() {
  return (
    <svg width="8" height="16" viewBox="0 0 8 16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.2279 1.19065L7.84662 1.80934C7.99306 1.95578 7.99306 2.19322 7.84662 2.33969L2.19978 8L7.84662 13.6603C7.99306 13.8067 7.99306 14.0442 7.84662 14.1907L7.2279 14.8094C7.08147 14.9558 6.84403 14.9558 6.69756 14.8094L0.153374 8.26518C0.00693607 8.11875 0.00693607 7.88131 0.153374 7.73484L6.69756 1.19065C6.84403 1.04419 7.08147 1.04419 7.2279 1.19065Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="8" height="16" viewBox="0 0 8 16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.772126 1.19065L0.153407 1.80934C0.00696973 1.95578 0.00696973 2.19322 0.153407 2.33969L5.80025 8L0.153407 13.6603C0.00696973 13.8067 0.00696973 14.0442 0.153407 14.1907L0.772126 14.8094C0.918563 14.9558 1.156 14.9558 1.30247 14.8094L7.84666 8.26519C7.99309 8.11875 7.99309 7.88131 7.84666 7.73484L1.30247 1.19065C1.156 1.04419 0.918563 1.04419 0.772126 1.19065Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function PopularCarousel() {
  const { onSwiper, onSlideChange, slidePrev, slideNext, isBeginning, isEnd } =
    useSwiperNav()

  return (
    <section className="popular" aria-label="Popular services">
      <div className="popular-inner">
        <h2 className="popular-title">Popular services</h2>

        <div className="popular-carousel">
          <button
            type="button"
            className={`popular-arrow left ${isBeginning ? 'is-hidden' : ''}`}
            aria-label="Scroll left"
            onClick={slidePrev}
          >
            <ChevronLeft />
          </button>

          <button
            type="button"
            className={`popular-arrow right ${isEnd ? 'is-hidden' : ''}`}
            aria-label="Scroll right"
            onClick={slideNext}
          >
            <ChevronRight />
          </button>

          {/* ✅ viewport wrapper to CLIP slides + mask the edges */}
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
                  <a className="popular-card" href={s.href} style={{ background: s.bg }}>
                    <h3 className="popular-card-title">
                      {s.title.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i === 0 && s.title.includes('\n') ? <br /> : null}
                        </React.Fragment>
                      ))}
                    </h3>

                    <div className="popular-card-media" aria-hidden="true">
                      <img src={s.img} alt="" loading="lazy" />
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  )
}
