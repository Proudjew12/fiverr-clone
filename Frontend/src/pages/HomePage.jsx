import { HomeHero } from '@/components/homepageComponents/HomeHero'
import { HomeCategories } from '@/components/homepageComponents/HomeCategories'
import { PopularCarousel } from '@/components/homepageComponents/PopularCarousel'
import { useRedirectIfSignedIn } from '@/hooks/useRedirectIfSignedIn'

export function HomePage() {
  useRedirectIfSignedIn()

  return (
    <section className="home-page">
      <HomeHero />
      <HomeCategories />
      <PopularCarousel />
    </section>
  )
}
