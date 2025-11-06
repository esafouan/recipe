import { getAllRecipes, getAllCategories } from "@/lib/recipes-data"
import { getSitemapConfig } from "@/lib/config"

export default async function sitemap() {
  const sitemapConfig = getSitemapConfig()
  const baseUrl = sitemapConfig.baseUrl

  // Static pages from config
  const staticPages = sitemapConfig.staticPages.map(page => ({
    url: `${baseUrl}${page.url}`,
    lastModified: page.lastModified === 'auto' ? new Date() : new Date(page.lastModified),
    changeFrequency: page.changeFrequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
    priority: page.priority,
  }))

  try {
    // Fetch dynamic data
    const [recipes, categories] = await Promise.all([
      getAllRecipes(),
      getAllCategories()
    ])

    // Category pages - use actual categories from database
    const categoryPages = categories.map(category => ({
      url: `${baseUrl}/recipes/${category.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: sitemapConfig.changeFrequency.categories as 'weekly',
      priority: sitemapConfig.priority.categories,
    }))

    // Individual recipe pages
    const recipePages = recipes.map(recipe => {
      // Ensure we have a valid date
      let lastModified = new Date()
      try {
        const publishedDate = new Date(recipe.datePublished)
        if (!isNaN(publishedDate.getTime())) {
          lastModified = publishedDate
        }
      } catch (error) {
        console.warn(`Invalid date for recipe ${recipe.slug}:`, recipe.datePublished)
      }

      return {
        url: `${baseUrl}/recipes/${recipe.slug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: sitemapConfig.priority.recipeDetail,
      }
    })

    return [
      ...staticPages,
      ...categoryPages,
      ...recipePages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Fallback to static pages only if data fetching fails
    const fallbackCategoryPages = ['breakfast', 'lunch', 'dinner', 'dessert', 'healthy'].map(category => ({
      url: `${baseUrl}/recipes/${category}`,
      lastModified: new Date(),
      changeFrequency: sitemapConfig.changeFrequency.categories as 'weekly',
      priority: sitemapConfig.priority.categories,
    }))

    return [
      ...staticPages,
      ...fallbackCategoryPages,
    ]
  }
}
