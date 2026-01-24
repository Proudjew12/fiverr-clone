import { SvgIcon } from '@/components/svg/SvgIcon'
import { SearchBar } from '@/components/homepageComponents/SearchBar'
import demoData from '@/data/demo-data.json'

const { heroChips: HERO_CHIPS, trustedBy: TRUSTED_BY } = demoData.home

export function HomeHero() {
  function onChipClick(ev) {
    ev.preventDefault()
  }

  return (
    <section className="home-hero">
      <video className="home-hero-video" autoPlay muted loop playsInline preload="auto">
        <source src="/assets/HomePage/video/HeroVid.webm" type="video/webm" />
      </video>

      <div className="home-hero-overlay" aria-hidden="true" />

      <div className="home-hero-inner">
        <div className="home-hero-content grid">
          <h1 className="home-hero-title">
            Our freelancers <br />
            will take it from here
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
                onClick={onChipClick}
              >
                {label}
                <span className="hero-arrow-right flex" aria-hidden="true">
                  <SvgIcon icon="arrowRight" />
                </span>
              </button>
            ))}
          </div>

          <div className="home-hero-trusted flex">
            <span className="home-hero-trustedLabel">Trusted by:</span>

            <div className="home-hero-trustedLogos flex">
              {TRUSTED_BY.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
