import { SvgIcon } from '@/components/svg/SvgIcon'
import { SearchBar } from '@/components/homepageComponents/SearchBar'
import demoData from '@/data/demo-data.json'
import { useNavigate } from 'react-router-dom'
import { gigService } from '@/services/gig.service.remote.js'
import { mediaUrlService } from '@/services/media-url.service'

const { heroChips: HERO_CHIPS, trustedBy: TRUSTED_BY } = demoData.home

const TRUSTED_BY_ICONS = {
  Meta: 'heroTrustedMeta',
  Google: 'heroTrustedGoogle',
  Netflix: 'heroTrustedNetflix',
  'P&G': 'heroTrustedPG',
  PayPal: 'heroTrustedPayPal',
  Payoneer: 'heroTrustedPayoneer',
}

export function HomeHero() {
  const navigate = useNavigate()

  const chipFilters = {
    'Website Development': { tag: 'web-builder' },
    'Architecture & Interior Design': { tag: 'shopify' },
    'UGC Videos': { tag: 'ad-social' },
    'Video Editing': { tag: 'video-editing' },
    'Book Publishing': { tag: 'shopify' },
  }

  function navigateWithFilter({ tag, txt }) {
    const base = gigService.getDefaultFilter()
    const filterBy = {
      ...base,
      txt: txt || '',
      tags: tag ? [tag] : [],
    }
    const params = gigService.buildSearchParamsFromFilter(filterBy)
    const search = params.toString()
    navigate(search ? `/index?${search}` : '/index')
  }

  return (
    <section className="home-hero">
      <video className="home-hero-video" autoPlay muted loop playsInline preload="auto">
        <source
          src={mediaUrlService.resolve('/assets/HomePage/video/HeroVid.webm')}
          type="video/webm"
        />
      </video>

      <div className="home-hero-overlay" aria-hidden="true" />

      <div className="home-hero-inner">
        <div className="home-hero-content">
          <h1 className="home-hero-title">
            <span className="home-hero-title-text">
              Our freelancers <br />
              will take it from here
            </span>
          </h1>

          <div className="home-hero-search" role="search">
            <SearchBar />
          </div>

          <div className="home-hero-chips flex">
            {HERO_CHIPS.map((label) => (
              <button
                key={label}
                type="button"
                className="home-hero-chip flex"
                onClick={() => navigateWithFilter(chipFilters[label] || { txt: label })}
              >
                <span className="home-hero-chip-label">{label}</span>
                <span className="hero-arrow-right flex" aria-hidden="true">
                  <SvgIcon icon="arrowRight" />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="home-hero-trusted">
          <span className="home-hero-trustedLabel">Trusted by:</span>

          <div className="home-hero-trustedLogos">
            {TRUSTED_BY.map((name) => {
              const icon = TRUSTED_BY_ICONS[name]
              const iconClassName = `home-hero-trustedIcon${name === 'Google' ? ' home-hero-trustedIcon--google' : ''}`
              return (
                <span key={name} className="home-hero-trustedLogo" aria-label={name}>
                  {icon ? <SvgIcon icon={icon} className={iconClassName} /> : name}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
