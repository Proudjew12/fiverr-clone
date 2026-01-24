import { SvgIcon } from '@/components/svg/SvgIcon'
import demoData from '@/data/demo-data.json'

const categories = demoData.home.categories

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
