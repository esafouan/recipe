'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RecipeCard } from '@/components/recipe-card'
import { Pagination } from '@/components/pagination'
import { getAllRecipes, getRecipesByCategory } from '@/lib/api'
import { Loader2 } from 'lucide-react'

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

const RECIPES_PER_PAGE = 12

export function AllRecipes({ category }: AllRecipesProps = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1
  
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalRecipes, setTotalRecipes] = useState(0)

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true)
      setError(null)
      
      try {
        let wpRecipes: any[] = []
        
        if (category) {
          // Fetch recipes by category from WordPress
          const { recipes: categoryRecipes } = await getRecipesByCategory(category)
          wpRecipes = categoryRecipes
        } else {
          // Fetch all recipes from WordPress
          wpRecipes = await getAllRecipes(1000) // Fetch all recipes
        }
        
        // Convert WordPress data to Recipe format
        const formattedRecipes = wpRecipes.map((recipe: any) => ({
          id: recipe.slug,
          slug: recipe.slug,
          title: recipe.title,
          image: recipe.images?.[0],
          featuredImage: recipe.images?.[0],
          category: category || recipe.meta?.dietary || 'Recipe',
          datePublished: recipe.date
        }))
        
        setTotalRecipes(formattedRecipes.length)
        
        // Paginate the recipes
        const startIndex = (currentPage - 1) * RECIPES_PER_PAGE
        const endIndex = startIndex + RECIPES_PER_PAGE
        const paginatedRecipes = formattedRecipes.slice(startIndex, endIndex)
        
        setRecipes(paginatedRecipes)
        
      } catch (err) {
        console.error('Error fetching recipes:', err)
        setError('Failed to load recipes. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchRecipes()
  }, [category, currentPage])

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`, { scroll: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalPages = Math.ceil(totalRecipes / RECIPES_PER_PAGE)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading recipes...</span>
      </div>
    )
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

  if (recipes.length === 0 && !loading) {
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
          Showing {((currentPage - 1) * RECIPES_PER_PAGE) + 1}-{Math.min(currentPage * RECIPES_PER_PAGE, totalRecipes)} of {totalRecipes} {category ? `${category.toLowerCase()} ` : ''}recipe{totalRecipes !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}
