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
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="m5.11 8.266 4.62 4.624a.38.38 0 0 0 .536 0l.623-.619a.373.373 0 0 0 0-.531L7.16 8l3.73-3.74a.373.373 0 0 0 0-.531l-.623-.619a.38.38 0 0 0-.535 0L5.11 7.734a.373.373 0 0 0 0 .532"></path>
      </svg>
    ),

    chevronRight: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M10.89 7.734 6.27 3.11a.38.38 0 0 0-.536 0l-.623.619a.373.373 0 0 0 0 .531L8.84 8l-3.73 3.74a.373.373 0 0 0 0 .531l.623.619a.38.38 0 0 0 .535 0l4.62-4.624a.373.373 0 0 0 0-.532"></path>
      </svg>
    ),
    userCircle: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 32 32"
        {...props}
        className={className}
      >
        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
        <circle cx="16" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M8.5 24c1.8-3.2 5-5 7.5-5s5.7 1.8 7.5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
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
