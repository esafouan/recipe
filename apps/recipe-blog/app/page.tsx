import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturedRecipes } from "@/components/featured-recipes"
import { RecipeBenefitsSection } from "@/components/recipe-benefits-section"
import { SocialProofSection } from "@/components/social-proof-section"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { HeaderAd, ContentAd, FooterAd } from "@/components/ad-space"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      {/* <HeaderAd /> */}
      <main className="flex-1">
        <HeroSection />
        <RecipeBenefitsSection />
        {/* <ContentAd /> */}
        <FeaturedRecipes />
        <SocialProofSection />
        <NewsletterSignup />
      </main>
      {/* <FooterAd /> */}
      <SiteFooter />
    </div>
  )
}
