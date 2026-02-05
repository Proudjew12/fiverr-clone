import { SvgIcon } from '@/components/svg/SvgIcon'
import { useNavigate } from 'react-router-dom'
import { gigService, categoryFilters, categories } from '@/services/gig.service.remote.js'

export function HomeCategories() {
  const navigate = useNavigate()

  function handleCategoryClick(cat) {
    const filter = categoryFilters[cat.key] || {
      txt: cat.label.replace(/\s+/g, ' '),
    }
    const baseFilter = gigService.getDefaultFilter()
    const filterBy = {
      ...baseFilter,
      txt: filter.txt || '',
      tags: filter.tag ? [filter.tag] : [],
    }
    const params = gigService.buildSearchParamsFromFilter(filterBy)
    const search = params.toString()
    navigate(`/index?${search || ''}`)
  }

  return (
    <section className="home-categories">
      {categories.map((cat) => (
        <button
          key={cat.key}
          className="home-category-card grid"
          onClick={() => handleCategoryClick(cat)}
        >
          <SvgIcon icon={cat.icon} />

          <span className="home-category-title">{cat.label}</span>
        </button>
      ))}
    </section>
  )
}
