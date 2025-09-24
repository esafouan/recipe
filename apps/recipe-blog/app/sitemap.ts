import { getAllRecipes, getAllCategories } from "@/lib/recipes-data"

export default async function sitemap() {
  const baseUrl = 'https://minirecipe.net' // Updated to match robots.ts

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  try {
    // Fetch dynamic data
    const [recipes, categories] = await Promise.all([
      getAllRecipes(),
      getAllCategories()
    ])

    // Category pages - use actual categories from database
    const categoryPages = categories.map(category => ({
      url: `${baseUrl}/categories/${category.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
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
        priority: 0.7,
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
      url: `${baseUrl}/categories/${category}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [
      ...staticPages,
      ...fallbackCategoryPages,
    ]
  }
}
