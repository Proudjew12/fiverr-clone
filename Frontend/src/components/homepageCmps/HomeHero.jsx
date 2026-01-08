import React from 'react'

import { svg } from '@/components/svg/LogoHeader'

export function HomeHero() {
  return (
    <section className="home-hero">
      <video className="home-hero-video" autoPlay muted loop playsInline preload="auto">
        <source src="/assets/HomePage/video/HeroVid.webm" type="video/webm" />
      </video>

      <div className="home-hero-overlay" aria-hidden="true" />

      <div className="home-hero-inner">
        <div className="home-hero-content">
          <h1 className="home-hero-title">
            Our freelancers <br />
            will take it from here
          </h1>

          {/* SEARCH */}
          <form className="home-hero-search" role="search">
            <input
              className="home-hero-searchInput"
              type="search"
              placeholder="Search for any service..."
              autoComplete="off"
            />
            <button className="home-hero-searchBtn" type="submit" aria-label="Search">
              <svg
                height="18"
                width="18"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="m15.89 14.653-3.793-3.794a.37.37 0 0 0-.266-.109h-.412A6.499 6.499 0 0 0 6.5 0C2.91 0 0 2.91 0 6.5a6.499 6.499 0 0 0 10.75 4.919v.412c0 .1.04.194.11.266l3.793 3.794a.375.375 0 0 0 .531 0l.707-.707a.375.375 0 0 0 0-.53ZM6.5 11.5c-2.763 0-5-2.238-5-5 0-2.763 2.237-5 5-5 2.762 0 5 2.237 5 5 0 2.762-2.238 5-5 5Z"
                />
              </svg>
            </button>
          </form>

          {/* CHIPS */}
          <div className="home-hero-chips">
            <a className="home-hero-chip" href="#">
              Website Development{' '}
              <span className="hero-arrow-right">{svg.ArrowRightIcon()}</span>
            </a>
            <a className="home-hero-chip" href="#">
              Architecture &amp; Interior Design{' '}
              <span className="hero-arrow-right">{svg.ArrowRightIcon()}</span>
            </a>
            <a className="home-hero-chip" href="#">
              UGC Videos <span className="hero-arrow-right">{svg.ArrowRightIcon()}</span>
            </a>
            <a className="home-hero-chip" href="#">
              Video Editing{' '}
              <span className="hero-arrow-right">{svg.ArrowRightIcon()}</span>
            </a>
            <a className="home-hero-chip" href="#">
              Book Publishing{' '}
              <span className="hero-arrow-right">{svg.ArrowRightIcon()}</span>
            </a>
          </div>

          {/* TRUSTED */}
          <div className="home-hero-trusted">
            <span className="home-hero-trustedLabel">Trusted by:</span>
            <div className="home-hero-trustedLogos">
              {/* put your svg/img logos here */}
              <span>Meta</span>
              <span>Google</span>
              <span>Netflix</span>
              <span>P&amp;G</span>
              <span>PayPal</span>
              <span>Payoneer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
