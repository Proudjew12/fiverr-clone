import { HomeHero } from '@/components/homepageComponents/HomeHero'
import { HomeCategories } from '@/components/homepageComponents/HomeCategories'
import { PopularCarousel } from '@/components/homepageComponents/PopularCarousel'

export function HomePage() {
  return (
    <section className="home-page">
      <HomeHero />
      <HomeCategories />
      <PopularCarousel />
    </section>
  )
}
