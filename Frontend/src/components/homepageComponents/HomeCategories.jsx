import { SvgIcon } from '@/components/svg/SvgIcon'

const categories = [
  { key: 'programming', label: 'Programming\n& Tech', icon: 'Programming' },
  { key: 'graphics', label: 'Graphics &\nDesign', icon: 'Graphics' },
  { key: 'marketing', label: 'Digital\nMarketing', icon: 'Marketing' },
  { key: 'writing', label: 'Writing &\nTranslation', icon: 'Writing' },
  { key: 'video', label: 'Video &\nAnimation', icon: 'Video' },
  { key: 'ai', label: 'AI Services', icon: 'AI' },
  { key: 'music', label: 'Music & Audio', icon: 'Music' },
  { key: 'business', label: 'Business', icon: 'Business' },
  { key: 'consulting', label: 'Consulting', icon: 'Consulting' },
]

export function HomeCategories({ onCategoryClick }) {
  function handleCategoryClick(cat) {
    onCategoryClick?.(cat)
  }

  return (
    <section className="home-categories" aria-label="Browse categories">
      <div className="home-categories-inner">
        <div className="home-categories-row flex" role="list">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className="home-category-card grid"
              role="listitem"
              onClick={() => handleCategoryClick(cat)}
            >
              <span className="home-category-icon grid place-center" aria-hidden="true">
                <SvgIcon icon={cat.icon} />
              </span>

              <span className="home-category-title">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
