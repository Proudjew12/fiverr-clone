import { SvgIcon } from '@/components/svg/SvgIcon'
import demoData from '@/data/demo-data.json'
import { useNavigate } from 'react-router-dom'
import { gigService } from '@/services/gig.service.remote.js'

const categories = demoData.home.categories

export function HomeCategories({ onCategoryClick }) {
  const navigate = useNavigate()

  const categoryFilters = {
    'web-builder': { tag: 'web-builder' },
    'video-editing': { tag: 'video-editing' },
    shopify: { tag: 'shopify' },
    'ad-social': { tag: 'ad-social' },
  }

  function handleCategoryClick(cat) {
    onCategoryClick?.(cat)
    const filter = categoryFilters[cat.key] || { txt: cat.label.replace(/\s+/g, ' ') }
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
