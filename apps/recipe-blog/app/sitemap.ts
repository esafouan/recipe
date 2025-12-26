import { MetadataRoute } from 'next'

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string
const FRONTEND_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://modernkitchen.net'

async function getAllRecipesFromWordPress() {
  const query = `
    query GetSitemapData {
      recipes(first: 1000) {
        nodes {
          slug
          modified
          date
        }
      }
    }
  `
  
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 }, // Revalidate sitemap every hour
    })
    
    if (!res.ok) {
      console.error('Failed to fetch recipes for sitemap')
      return []
    }
    
    const json = await res.json()
    return json.data?.recipes?.nodes || []
  } catch (error) {
    console.error('Error fetching recipes for sitemap:', error)
    return []
  }
}

async function getAllCategoriesFromWordPress() {
  const query = `
    query GetCategories {
      recipeCategories(first: 100) {
        nodes {
          slug
          name
        }
      }
    }
  `
  
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 },
    })
    
    if (!res.ok) {
      console.error('Failed to fetch categories for sitemap')
      return []
    }
    
    const json = await res.json()
    return json.data?.recipeCategories?.nodes || []
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Pages
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/recipes',
    '/categories',
    '/disclaimer',
    '/privacy',
    '/terms',
    '/terms-of-use',
  ].map((route) => ({
    url: `${FRONTEND_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  try {
    // 2. Fetch dynamic data from WordPress
    const [recipes, categories] = await Promise.all([
      getAllRecipesFromWordPress(),
      getAllCategoriesFromWordPress(),
    ])

    console.log(`📄 Generating sitemap with ${recipes.length} recipes and ${categories.length} categories`)

    // 3. Category Pages
    const categoryRoutes = categories.map((category: any) => ({
      url: `${FRONTEND_URL}/recipes/${category.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // 4. Individual Recipe Pages
    const recipeRoutes = recipes.map((recipe: any) => ({
      url: `${FRONTEND_URL}/recipes/${recipe.slug}`,
      lastModified: recipe.modified || recipe.date || new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...categoryRoutes, ...recipeRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Fallback to static pages only if data fetching fails
    return staticRoutes
  }
}
