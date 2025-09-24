"use client"

import { useEffect, useState } from "react"
import { getAllRecipes, getAllCategories } from "@/lib/recipes-data"
import { type BlogRecipe } from "@/lib/types/recipe"
import { RecipeArchive } from "./recipe-archive"

interface RecipeArchiveWrapperProps {
  defaultCategory?: string
}

export function RecipeArchiveWrapper({ defaultCategory = "all" }: RecipeArchiveWrapperProps) {
  const [recipes, setRecipes] = useState<BlogRecipe[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [fetchedRecipes, fetchedCategories] = await Promise.all([
          getAllRecipes(),
          getAllCategories()
        ])
        
        setRecipes(fetchedRecipes)
        setCategories(fetchedCategories)
      } catch (err) {
        console.error('Error fetching recipe data:', err)
        setError('Failed to load recipes')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="py-8">
        <div className="container px-4">
          <div className="text-center space-y-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="container px-4">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-red-600">Error Loading Recipes</h2>
            <p className="text-muted-foreground">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <RecipeArchive 
      recipes={recipes}
      categories={categories}
      defaultCategory={defaultCategory}
    />
  )
}
