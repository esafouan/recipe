import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { RecipeDetail } from "@/components/recipe-detail"
import { RecipeSchema } from "@/components/recipe-schema"
import { getRecipeBySlug, getAllRecipes, RecipeData } from "@/lib/recipes-data"

interface RecipePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params
  const recipe : RecipeData | null = await getRecipeBySlug(slug)

  if (!recipe) {
    notFound()
  }

  // Fetch related recipes from the same category
  let relatedRecipes: Array<{
    id: string
    title: string
    image: string
    slug: string
  }> = []

  try {
    const allRecipes = await getAllRecipes()
    const filteredRelated = allRecipes
      .filter(r => {
        const rSlug = r.metadata.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        return rSlug !== slug && r.metadata.recipeCategory === recipe.metadata.recipeCategory
      })
      .slice(0, 4) // Take first 4
      .map(r => {
        const rSlug = r.metadata.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        return {
          id: rSlug,
          title: r.metadata.name,
          image: r.metadata.images[0] || '/api/placeholder/200/150',
          slug: rSlug
        }
      })
    
    // If we don't have 4 from same category, fill with any other recipes
    if (filteredRelated.length < 4) {
      const otherRecipes = allRecipes
        .filter(r => {
          const rSlug = r.metadata.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
          return rSlug !== slug && !filteredRelated.some(fr => fr.id === rSlug)
        })
        .slice(0, 4 - filteredRelated.length)
        .map(r => {
          const rSlug = r.metadata.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
          return {
            id: rSlug,
            title: r.metadata.name,
            image: r.metadata.images[0] || '/api/placeholder/200/150',
            slug: rSlug
          }
        })
      
      relatedRecipes = [...filteredRelated, ...otherRecipes]
    } else {
      relatedRecipes = filteredRelated
    }
  } catch (error) {
    console.warn('Could not fetch related recipes:', error)
    // relatedRecipes will remain empty array, component will use defaults
  }

  return (
    <div className="min-h-screen flex flex-col">
      <RecipeSchema recipe={recipe} />
      <main className="flex-1">
        <RecipeDetail recipe={recipe} relatedRecipes={relatedRecipes} />
      </main>
    </div>
  )
}
