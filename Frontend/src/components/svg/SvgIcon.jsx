export function SvgIcon({ icon, className = '', ...props }) {
  const el = _getIcon(icon, { className, props })
  return <>{el || null}</>
}

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
        {...props}
        className={className}
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
    star: (
      <svg
        width="16"
        height="15"
        viewBox="0 0 16 15"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        className={className}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 5.81285C16 5.98299 15.875 6.14367 15.75 6.26654L12.2596 9.61248L13.0865 14.3384C13.0962 14.4045 13.0962 14.4612 13.0962 14.5274C13.0962 14.7732 12.9808 15 12.7019 15C12.5673 15 12.4327 14.9527 12.3173 14.8866L8 12.656L3.68269 14.8866C3.55769 14.9527 3.43269 15 3.29808 15C3.01923 15 2.89423 14.7732 2.89423 14.5274C2.89423 14.4612 2.90385 14.4045 2.91346 14.3384L3.74038 9.61248L0.240385 6.26654C0.125 6.14367 0 5.98299 0 5.81285C0 5.5293 0.298077 5.41588 0.538462 5.37807L5.36539 4.68809L7.52885 0.387524C7.61539 0.207939 7.77885 0 8 0C8.22115 0 8.38462 0.207939 8.47115 0.387524L10.6346 4.68809L15.4615 5.37807C15.6923 5.41588 16 5.5293 16 5.81285Z"
        ></path>
      </svg>
    ),
    vBlack: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 11 9"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentFill"
        {...props}
        className={className}
      >
        <path d="M3.645 8.102.158 4.615a.536.536 0 0 1 0-.759l.759-.758c.21-.21.549-.21.758 0l2.35 2.349L9.054.416c.21-.21.55-.21.759 0l.758.758c.21.21.21.55 0 .759L4.403 8.102c-.209.21-.549.21-.758 0Z"></path>
      </svg>
    ),
    vGray: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 11 9"
        xmlns="http://www.w3.org/2000/svg"
        fill="#dadbdd"
        {...props}
        className={className}
      >
        <path d="M3.645 8.102.158 4.615a.536.536 0 0 1 0-.759l.759-.758c.21-.21.549-.21.758 0l2.35 2.349L9.054.416c.21-.21.55-.21.759 0l.758.758c.21.21.21.55 0 .759L4.403 8.102c-.209.21-.549.21-.758 0Z"></path>
      </svg>
    ),
    rightArrow: (
      <svg
        width="16"
        height="16"
        fill="white"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        className={className}
      >
        <path d="M9.92332 2.96885C9.63854 2.66807 9.1768 2.66807 8.89202 2.96885C8.60723 3.26963 8.60723 3.75729 8.89202 4.05807L11.6958 7.01931H1.48616C1.08341 7.01931 0.756918 7.36413 0.756918 7.7895C0.756918 8.21487 1.08341 8.5597 1.48616 8.5597H11.8436L8.89202 11.677C8.60723 11.9778 8.60723 12.4654 8.89202 12.7662C9.1768 13.067 9.63854 13.067 9.92332 12.7662L14.0459 8.41213C14.3307 8.11135 14.3307 7.62369 14.0459 7.32291L13.977 7.25011C13.9737 7.24661 13.9704 7.24315 13.9671 7.23972L9.92332 2.96885Z"></path>
      </svg>
    ),
    downArrow: (
      <svg
        width="10"
        height="10"
        viewBox="0 0 14 9"
        xmlns="http://www.w3.org/2000/svg"
        fill="grey_1100"
        {...props}
        className={className}
      >
        <path d="M.19 1.272.81.653a.375.375 0 0 1 .53 0L7 6.3 12.66.653a.375.375 0 0 1 .53 0l.62.62a.375.375 0 0 1 0 .53L7.264 8.346a.375.375 0 0 1 -.53 0L.19 1.802a.375.375 0 0 1 0-.53Z"></path>
      </svg>
    ),
    time: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        className={className}
      >
        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"></path>
        <path d="M9 4H7v5h5V7H9V4z"></path>
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
        {...props}
        className={className}
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
        {...props}
        className={className}
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
    headerBell: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
        className={className}
      >
        <path
          d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 2.5 6.5H3.5C4.5 14.5 6 13 6 9Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 18a2.5 2.5 0 0 0 5 0"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    headerMail: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
        className={className}
      >
        <path
          d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="m4 7 8 6 8-6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    headerHeart: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
        className={className}
      >
        <path
          d="M12 20.5s-6.5-4.6-9-7.9C1.2 10.3 2.1 7.1 4.8 6.2c2-0.7 3.9 0.2 5.2 1.7 1.3-1.5 3.2-2.4 5.2-1.7 2.7 0.9 3.6 4.1 1.8 6.4-2.5 3.3-9 7.9-9 7.9Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
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
        {...props}
        className={className}
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
    starBlack: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="10" height="10" fill="currentColor"><path d="M4.839.22a.2.2 0 0 1 .322 0l1.942 2.636a.2.2 0 0 0 .043.043L9.782 4.84a.2.2 0 0 1 0 .322L7.146 7.105a.2.2 0 0 0-.043.043L5.161 9.784a.2.2 0 0 1-.322 0L2.897 7.148a.2.2 0 0 0-.043-.043L.218 5.163a.2.2 0 0 1 0-.322l2.636-1.942a.2.2 0 0 0 .043-.043L4.839.221Z"></path></svg>
    ),
    starTranspet: (
      <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 10" width="10" height="10"
        fill="#E4E5E7"><path d="M4.839.22a.2.2 0 0 1
   .322 0l1.942 2.636a.2.2 0 0 0 .043.043L9.782
    4.84a.2.2 0 0 1 0 .322L7.146 7.105a.2.2 0 0
     0-.043.043L5.161 9.784a.2.2 0 0 1-.322 0L2.897
      7.148a.2.2 0 0 0-.043-.043L.218 5.163a.2.2 0
       0 1 0-.322l2.636-1.942a.2.2 0 0 0 .043-.043L4.839.221Z">
        </path></svg>
    ),

    wishlistHeart: (iconProps) => {
      const {
        filled = false,
        fillColor = '#ffffff',
        strokeColor = '#ffffff',
        className: innerClassName,
        ...rest
      } = iconProps || {}
      const finalClassName = innerClassName || className

      return (
        <svg
          className={finalClassName}
          viewBox="0 0 24 24"
          aria-hidden="true"
          {...rest}
        >
          <path
            d="M12 20.8c-.3 0-.6-.1-.8-.3-2.2-1.9-6.7-5.6-8.5-8-1.6-2.1-1.2-5.2 1-6.8 2-1.4 4.7-.8 6.3 1 1.6-1.8 4.3-2.4 6.3-1 2.2 1.6 2.6 4.7 1 6.8-1.8 2.4-6.3 6.1-8.5 8-.2.2-.5.3-.8.3Z"
            fill={filled ? fillColor : 'none'}
            stroke={strokeColor}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )
    },

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

  if (typeof val === 'function') return val({ className, ...props })

  return val
}
