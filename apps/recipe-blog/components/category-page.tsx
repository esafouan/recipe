import { AllRecipes } from "@/components/all-recipes"
import { BasicHero } from "@/components/basic-hero"
import { getCategoryRecipesConfig } from "@/lib/config"

interface CategoryPageProps {
  category: string
}

export function CategoryPage({ category }: CategoryPageProps) {
  const categoryConfig = getCategoryRecipesConfig(category)
  
  if (!categoryConfig) {
    throw new Error(`Configuration not found for category: ${category}`)
  }
  
  const { title, description } = categoryConfig

  // Generate breadcrumbs
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: title }
  ]
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section with Breadcrumbs */}
        <BasicHero
          title={title}
          description={description}
          breadcrumbs={breadcrumbs}
        />

        {/* Category Recipes Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <AllRecipes category={category} />
          </div>
        </section>
      </main>
    </div>
  )
}
