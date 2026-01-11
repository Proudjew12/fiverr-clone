import React from 'react'

const categories = [
  { key: 'programming', label: 'Programming\n& Tech', icon: IconProgramming },
  { key: 'graphics', label: 'Graphics &\nDesign', icon: IconGraphics },
  { key: 'marketing', label: 'Digital\nMarketing', icon: IconMarketing },
  { key: 'writing', label: 'Writing &\nTranslation', icon: IconWriting },
  { key: 'video', label: 'Video &\nAnimation', icon: IconVideo },
  { key: 'ai', label: 'AI Services', icon: IconAI },
  { key: 'music', label: 'Music & Audio', icon: IconMusic },
  { key: 'business', label: 'Business', icon: IconBusiness },
  { key: 'consulting', label: 'Consulting', icon: IconConsulting },
]

export function HomeCategories({ onCategoryClick }) {
  function handleClick(cat) {
    if (onCategoryClick) onCategoryClick(cat)
  }

  return (
    <section className="home-categories" aria-label="Browse categories">
      <div className="home-categories-inner">
        <div className="home-categories-row" role="list">
          {categories.map((cat) => {
            const Icon = cat.icon

            return (
              <button
                key={cat.key}
                type="button"
                className="home-category-card"
                role="listitem"
                onClick={() => handleClick(cat)}
              >
                <span className="home-category-icon" aria-hidden="true">
                  <Icon />
                </span>

                <span className="home-category-title">
                  {cat.label.split('\n').map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      {idx === 0 ? <br /> : null}
                    </React.Fragment>
                  ))}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------- icons (simple + clean, stroke like Fiverr) ---------- */

function IconBase({ children }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  )
}

function IconProgramming() {
  return (
    <IconBase>
      <rect
        x="3"
        y="5"
        width="18"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M7 19h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M9 10l-2 2 2 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 10l2 2-2 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  )
}

function IconGraphics() {
  return (
    <IconBase>
      <rect
        x="5"
        y="6"
        width="14"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M9 10h6v6H9z" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 10h-2M21 10h-2M10 6V4M14 6V4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </IconBase>
  )
}

function IconMarketing() {
  return (
    <IconBase>
      <path
        d="M4 10h6l8-3v10l-8-3H4v-4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M10 14v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </IconBase>
  )
}

function IconWriting() {
  return (
    <IconBase>
      <path d="M7 5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7 9h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7 13h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M15.5 9.5l3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 18l2.5-.5 5-5-2-2-5 5L14 18z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </IconBase>
  )
}

function IconVideo() {
  return (
    <IconBase>
      <rect
        x="4"
        y="6"
        width="14"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M11 10l3 2-3 2v-4z" fill="currentColor" />
    </IconBase>
  )
}

function IconAI() {
  return (
    <IconBase>
      <path
        d="M12 3l1.2 2.8L16 7l-2.8 1.2L12 11l-1.2-2.8L8 7l2.8-1.2L12 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect
        x="6"
        y="12"
        width="12"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M9 15h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </IconBase>
  )
}

function IconMusic() {
  return (
    <IconBase>
      <path
        d="M10 18a2 2 0 1 1-1-1.732V6l10-2v9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M20 15a2 2 0 1 1-1-1.732V4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </IconBase>
  )
}

function IconBusiness() {
  return (
    <IconBase>
      <path
        d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="4"
        y="7"
        width="16"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 11h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </IconBase>
  )
}

function IconConsulting() {
  return (
    <IconBase>
      <path
        d="M7 18h9a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v10l2-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 10h6M9 13h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </IconBase>
  )
}
