import { CategoriesSection } from "@/components/categories-section"
import { HeroSection } from "@/components/hero-section"
import { RecentRecipes } from "@/components/recent-recipes"

export default function HomePage() {
  return (
      <>
        <HeroSection />
        <CategoriesSection />   
        <RecentRecipes />
      </>
  )
}
