import type { Metadata } from "next"
import { AllRecipes } from "@/components/all-recipes"
import { BasicHero } from "@/components/basic-hero"
import { getAllRecipesConfig } from "@/lib/config"
import { SectionHeader } from "@/components/section-header"

const recipesConfig = getAllRecipesConfig()

// Generate breadcrumbs
const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "All Recipes" }
]

export const metadata: Metadata = {
  title: recipesConfig.metadata.title,
  description: recipesConfig.metadata.description,
  keywords: recipesConfig.metadata.keywords,
  openGraph: {
    title: recipesConfig.metadata.openGraph.title,
    description: recipesConfig.metadata.openGraph.description,
    type: recipesConfig.metadata.openGraph.type as "website",
  },
}

export default function RecipesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section with Breadcrumbs */}
        <BasicHero
          title={recipesConfig.title}
          description={recipesConfig.description}
          breadcrumbs={breadcrumbs}
        />

        {/* Recipes Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
            <div className="text-center mb-8 md:mb-12 relative">
              <SectionHeader title={recipesConfig.title} />
            </div>
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <AllRecipes />
          </div>
        </section>
      </main>
    </div>
  )
}
