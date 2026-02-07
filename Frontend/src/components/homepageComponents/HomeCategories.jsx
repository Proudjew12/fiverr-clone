import { useNavigate } from 'react-router-dom'
import { SvgIcon } from '@/components/svg/SvgIcon'
import { categories, categoryFilters, gigService } from '@/services/gig.service.remote.js'

export function HomeCategories() {
  const navigate = useNavigate()

  function buildSearchQuery(category) {
    const { tag, txt = '' } = categoryFilters[category.key] || {}
    const defaultFilter = gigService.getDefaultFilter()
    const filterBy = {
      ...defaultFilter,
      txt,
      tags: tag ? [tag] : [],
    }

    return gigService.buildSearchParamsFromFilter(filterBy).toString()
  }

  function onCategoryClick(category) {
    const query = buildSearchQuery(category)
    navigate(query ? `/index?${query}` : '/index')
  }

  return (
    <section className="home-categories">
      {categories.map((category) => (
        <button
          key={category.key}
          className="home-category-card grid"
          onClick={() => onCategoryClick(category)}
        >
          <SvgIcon icon={category.icon} />

          <span className="home-category-title">{category.label}</span>
        </button>
      ))}
    </section>
  )
}
