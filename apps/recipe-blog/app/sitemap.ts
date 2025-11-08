import { getAllRecipes } from "@/lib/recipes-data"
import { getSitemapConfig } from "@/lib/config"
import { generateSlug } from "@/lib/schema-utils"

export default async function sitemap() {
  const sitemapConfig = getSitemapConfig()
  const baseUrl = sitemapConfig.baseUrl
  const categories = sitemapConfig.categories
  // Static pages from config
  const staticPages = sitemapConfig.staticPages.map(page => ({
    url: `${baseUrl}${page.url}`,
    lastModified: page.lastModified === 'auto' ? new Date() : new Date(page.lastModified),
    changeFrequency: page.changeFrequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
    priority: page.priority,
  }))

  try {
    // Fetch dynamic data
    const [recipes] = await Promise.all([
      getAllRecipes(),
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
      // Generate slug from recipe name
      const slug = generateSlug(recipe.metadata.name)
      
      // Ensure we have a valid date
      let lastModified = new Date()
      try {
        const publishedDate = new Date(recipe.metadata.datePublished)
        if (!isNaN(publishedDate.getTime())) {
          lastModified = publishedDate
        }
      } catch (error) {
        console.warn(`Invalid date for recipe ${recipe.metadata.name}:`, recipe.metadata.datePublished)
      }

      return {
        url: `${baseUrl}/recipes/${slug}`,
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
