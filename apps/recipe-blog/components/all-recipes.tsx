'use client'

import { useState, useEffect } from 'react'
import { RecipeCard } from '@/components/recipe-card'
import { Pagination } from '@/components/pagination'

type Recipe = {
  id: string
  slug: string
  title: string
  image: string
  featuredImage?: string
  category: string
  datePublished: string
}

const RECIPES_PER_PAGE = 9

interface AllRecipesProps {
  category?: string
}

export function AllRecipes({ category }: AllRecipesProps = {}) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true)
        const response = await fetch('/api/recipes/all')
        
        if (!response.ok) {
          throw new Error('Failed to fetch recipes')
        }
        
        const data = await response.json()
        
        // Process and normalize the recipe data
        const processedRecipes = data.map((recipe: any) => {
          let datePublished = new Date().toISOString()
          
          // Handle different date formats from Firebase
          try {
            if (recipe.datePublished?.toDate) {
              datePublished = recipe.datePublished.toDate().toISOString()
            } else if (recipe.publishedAt?.toDate) {
              datePublished = recipe.publishedAt.toDate().toISOString()
            } else if (recipe.datePublished) {
              // Try to parse the date, with fallback for invalid dates
              const parsedDate = new Date(recipe.datePublished)
              if (!isNaN(parsedDate.getTime())) {
                datePublished = parsedDate.toISOString()
              }
            }
          } catch (error) {
            console.warn('Invalid date for recipe:', recipe.title || recipe.id, 'Using current date as fallback')
            // datePublished already set to current date as fallback
          }
          
          return {
            id: recipe.id,
            slug: recipe.slug || '',
            title: recipe.title || '',
            image: recipe.featuredImage || recipe.image || '/Yay-Recipes-84-1.webp',
            featuredImage: recipe.featuredImage,
            category: recipe.category || 'Recipe',
            datePublished
          }
        })
        
        // Filter recipes by category if specified
        const filteredRecipes = category 
          ? processedRecipes.filter((recipe: Recipe) => 
              recipe.category.toLowerCase() === category.toLowerCase()
            )
          : processedRecipes
        
        setRecipes(filteredRecipes)
      } catch (err) {
        console.error('Error fetching recipes:', err)
        setError('Failed to load recipes. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  const totalPages = Math.ceil(recipes.length / RECIPES_PER_PAGE)
  const startIndex = (currentPage - 1) * RECIPES_PER_PAGE
  const endIndex = startIndex + RECIPES_PER_PAGE
  const currentRecipes = recipes.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of recipes section
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
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
          Showing {startIndex + 1}-{Math.min(endIndex, recipes.length)} of {recipes.length} {category ? `${category.toLowerCase()} ` : ''}recipes
        </p>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
        {currentRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
