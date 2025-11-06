import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { RecentRecipes } from "@/components/recent-recipes"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      {/* <HeaderAd /> */}
      <div className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <RecentRecipes />
        {/* <ContentAd /> */}
      </div>
      {/* <FooterAd /> */}
      <SiteFooter />
    </div>
  )
}
