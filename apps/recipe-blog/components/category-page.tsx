import { AllRecipes } from "@/components/all-recipes"
import { BasicHero } from "@/components/basic-hero"
import { getCategoryRecipesConfig } from "@/lib/config"
import { getRecipesByCategory, getCategoryInfo, getWpSlugFromConfigKey } from "@/lib/api"

interface CategoryPageProps {
  category: string // This should be the config key (e.g., 'soups-stews', 'main-dishes', 'breads')
}

export async function CategoryPage({ category }: CategoryPageProps) {
  const categoryConfig = getCategoryRecipesConfig(category)
  
  if (!categoryConfig) {
    throw new Error(`Configuration not found for category: ${category}`)
  }
  
  // Get the WordPress slug from the config key using the mapping
  const wpSlug = getWpSlugFromConfigKey(category)
  const categoryInfo = getCategoryInfo(wpSlug)
  
  // Always use mapped label for consistency (this is our user-friendly label)
  const title = categoryInfo.label || categoryConfig.title
  let description = categoryInfo.description || categoryConfig.description
  
  // Try to fetch description from WordPress if available
  try {
    const { categoryDescription } = await getRecipesByCategory(wpSlug)
    if (categoryDescription) {
      description = categoryDescription
    }
  } catch (error) {
    console.warn(`Could not fetch category "${wpSlug}" from WordPress, using mapping/config:`, error)
    // Fall back to mapping or config values already set
  }

  // Generate breadcrumbs with mapped label
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: title } // This will always use our mapped label (e.g., "Soups & Stews" for "soup")
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
            <AllRecipes category={wpSlug} />
          </div>
        </section>
      </main>
    </div>
  )
}
