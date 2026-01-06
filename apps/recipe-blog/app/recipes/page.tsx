import type { Metadata } from "next"
import { Suspense } from "react"
import { AllRecipes } from "@/components/all-recipes"
import { BasicHero } from "@/components/basic-hero"
import { getAllRecipesConfig } from "@/lib/config"
import { SectionHeader } from "@/components/section-header"
import { Loader2 } from "lucide-react"

const recipesConfig = getAllRecipesConfig()

// Enable ISR for the recipes page
export const revalidate = 60 // Revalidate every 60 seconds

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
            <Suspense 
              fallback={
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-gray-600">Loading recipes...</span>
                </div>
              }
            >
              <AllRecipes />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  )
}
