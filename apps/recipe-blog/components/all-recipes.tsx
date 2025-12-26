import { RecipeCard } from '@/components/recipe-card'
import { getAllRecipes, getRecipesByCategory } from '@/lib/api'

type Recipe = {
  id: string
  slug: string
  title: string
  image: string
  featuredImage?: string
  category: string
  datePublished: string
}

interface AllRecipesProps {
  category?: string
}

export async function AllRecipes({ category }: AllRecipesProps = {}) {
  let recipes: Recipe[] = []
  let error: string | null = null

  try {
    if (category) {
      // Fetch recipes by category from WordPress
      const { recipes: wpRecipes } = await getRecipesByCategory(category)
      
      // Convert WordPress data to Recipe format
      recipes = wpRecipes.map((recipe: any) => ({
        id: recipe.slug,
        slug: recipe.slug,
        title: recipe.title,
        image: recipe.images?.[0] ,
        featuredImage: recipe.images?.[0],
        category: category,
        datePublished: recipe.date
      }))
    } else {
      // Fetch all recipes from WordPress
      const wpRecipes = await getAllRecipes(100) // Fetch more recipes
      
      // Convert WordPress data to Recipe format
      recipes = wpRecipes.map((recipe: any) => ({
        id: recipe.slug,
        slug: recipe.slug,
        title: recipe.title,
        image: recipe.images?.[0],
        featuredImage: recipe.images?.[0],
        category: recipe.meta?.dietary || 'Recipe',
        datePublished: recipe.date
      }))
    }
  } catch (err) {
    console.error('Error fetching recipes:', err)
    error = 'Failed to load recipes. Please try again later.'
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No recipes found.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Results Summary */}
      <div className="mb-8 text-center">
        <p className="text-gray-600">
          Showing {recipes.length} {category ? `${category.toLowerCase()} ` : ''}recipe{recipes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}
