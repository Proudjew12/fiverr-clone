import { HomeHero } from '@/components/homepageCmps/HomeHero'
import { HomeCategories } from '@/components/homepageCmps/HomeCategories'
import { PopularCarousel } from '@/components/homepageCmps/PopularCarousel'

export function HomePage() {
  return (
    <section className="home-page">
      <HomeHero />
      <HomeCategories />
      <PopularCarousel />
    </section>
  )
}
