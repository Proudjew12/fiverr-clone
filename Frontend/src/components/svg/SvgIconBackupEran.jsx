export function SvgIcon({ icon, className = '', ...props }) {
  const el = _getIcon(icon, { className, props })
  return <>{el || null}</>
}

export const FOOTER_SOCIAL_LINKS = [
  { key: 'linkedin', label: 'LinkedIn', icon: 'footerLinkedIn', href: '#' },
  { key: 'github', label: 'GitHub', icon: 'footerGithub', href: '#' },
]

function _getIcon(icon, ctx) {
  const { className, props } = ctx || {}

  const icons = {
    arrowRight: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 17"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="m10.531 13.037 4.219-4.219m0 0L10.531 4.6m4.219 4.218H1.25"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    ),

    chevronDown: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 16 17"
        {...props}
        className={className}
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="16"
          strokeWidth="1.5"
          d="m4 6.818 4 4 4-4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    ),

    chevronLeft: (
      <svg
        width="8"
        height="16"
        viewBox="0 0 8 16"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        {...props}
        className={className}
      >
        <path
          d="M7.2279 1.19065L7.84662 1.80934C7.99306 1.95578 7.99306 2.19322 7.84662 2.33969L2.19978 8L7.84662 13.6603C7.99306 13.8067 7.99306 14.0442 7.84662 14.1907L7.2279 14.8094C7.08147 14.9558 6.84403 14.9558 6.69756 14.8094L0.153374 8.26518C0.00693607 8.11875 0.00693607 7.88131 0.153374 7.73484L6.69756 1.19065C6.84403 1.04419 7.08147 1.04419 7.2279 1.19065Z"
          fill="currentColor"
        />
      </svg>
    ),

    chevronRight: (
      <svg
        width="8"
        height="16"
        viewBox="0 0 8 16"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        {...props}
        className={className}
      >
        <path
          d="M0.772126 1.19065L0.153407 1.80934C0.00696973 1.95578 0.00696973 2.19322 0.153407 2.33969L5.80025 8L0.153407 13.6603C0.00696973 13.8067 0.00696973 14.0442 0.153407 14.1907L0.772126 14.8094C0.918563 14.9558 1.156 14.9558 1.30247 14.8094L7.84666 8.26519C7.99309 8.11875 7.99309 7.88131 7.84666 7.73484L1.30247 1.19065C1.156 1.04419 0.918563 1.04419 0.772126 1.19065Z"
          fill="currentColor"
        />
      </svg>
    ),

    headerGlobe: (
      <img
        src="/assets/HeaderIcons/3[H].svg"
        alt=""
        draggable="false"
        {...props}
        className={className}
      />
    ),

    headerSearch: (
      <img
        src="/assets/HeaderIcons/5[H].svg"
        alt=""
        draggable="false"
        {...props}
        className={className}
      />
    ),

    footerLinkedIn: (
      <img
        src="/assets/FooterIcons/2[F].svg"
        alt=""
        draggable="false"
        {...props}
        className={className}
      />
    ),

    footerGithub: (
      <img
        src="/assets/FooterIcons/4[F].svg"
        alt=""
        draggable="false"
        {...props}
        className={className}
      />
    ),

    footerGlobe: (
      <img
        src="/assets/FooterIcons/1[F].svg"
        alt=""
        draggable="false"
        {...props}
        className={className}
      />
    ),

    footerAccessibility: (
      <img
        src="/assets/FooterIcons/3[F].svg"
        alt=""
        draggable="false"
        {...props}
        className={className}
      />
    ),

    popularCarousel1: (
      <img
        src="/assets/PopularCarouselImgs/1[Carousel].png"
        alt=""
        draggable="false"
        loading="lazy"
        {...props}
        className={className}
      />
    ),
    popularCarousel2: (
      <img
        src="/assets/PopularCarouselImgs/2[Carousel].png"
        alt=""
        draggable="false"
        loading="lazy"
        {...props}
        className={className}
      />
    ),
    popularCarousel3: (
      <img
        src="/assets/PopularCarouselImgs/3[Carousel].png"
        alt=""
        draggable="false"
        loading="lazy"
        {...props}
        className={className}
      />
    ),
    popularCarousel4: (
      <img
        src="/assets/PopularCarouselImgs/4[Carousel].png"
        alt=""
        draggable="false"
        loading="lazy"
        {...props}
        className={className}
      />
    ),
    popularCarousel5: (
      <img
        src="/assets/PopularCarouselImgs/5[Carousel].png"
        alt=""
        draggable="false"
        loading="lazy"
        {...props}
        className={className}
      />
    ),
    popularCarousel6: (
      <img
        src="/assets/PopularCarouselImgs/6[Carousel].png"
        alt=""
        draggable="false"
        loading="lazy"
        {...props}
        className={className}
      />
    ),
    popularCarousel7: (
      <img
        src="/assets/PopularCarouselImgs/7[Carousel].png"
        alt=""
        draggable="false"
        loading="lazy"
        {...props}
        className={className}
      />
    ),
    popularCarousel8: (
      <img
        src="/assets/PopularCarouselImgs/8[Carousel].png"
        alt=""
        draggable="false"
        loading="lazy"
        {...props}
        className={className}
      />
    ),

    heroSearch: (
      <svg
        height="18"
        width="18"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="m15.89 14.653-3.793-3.794a.37.37 0 0 0-.266-.109h-.412A6.499 6.499 0 0 0 6.5 0C2.91 0 0 2.91 0 6.5a6.499 6.499 0 0 0 10.75 4.919v.412c0 .1.04.194.11.266l3.793 3.794a.375.375 0 0 0 .531 0l.707-.707a.375.375 0 0 0 0-.53ZM6.5 11.5c-2.763 0-5-2.238-5-5 0-2.763 2.237-5 5-5 2.762 0 5 2.237 5 5 0 2.762-2.238 5-5 5Z"
        />
      </svg>
    ),
    proHireIcon: (
      <img
        src="/assets/HeaderIcons/1[H].png"
        alt=""
        width={56}
        height={56}
        loading="lazy"
        draggable="false"
        {...props}
        className={className}
      />
    ),

    proOfferIcon: (
      <img
        src="/assets/HeaderIcons/2[H].png"
        alt=""
        width={56}
        height={56}
        loading="lazy"
        draggable="false"
        {...props}
        className={className}
      />
    ),

    Programming: '/assets/HomeCategoriesSvg/1[Categories].svg',
    Graphics: '/assets/HomeCategoriesSvg/2[Categories].svg',
    Marketing: '/assets/HomeCategoriesSvg/3[Categories].svg',
    Writing: '/assets/HomeCategoriesSvg/4[Categories].svg',
    Video: '/assets/HomeCategoriesSvg/5[Categories].svg',
    AI: '/assets/HomeCategoriesSvg/6[Categories].svg',
    Music: '/assets/HomeCategoriesSvg/7[Categories].svg',
    Business: '/assets/HomeCategoriesSvg/8[Categories].svg',
    Consulting: '/assets/HomeCategoriesSvg/9[Categories].svg',
  }

  const val = icons[icon]

  if (typeof val === 'string') {
    return (
      <img
        src={val}
        alt=""
        aria-hidden="true"
        draggable="false"
        {...props}
        className={className}
      />
    )
  }

  return val
}
