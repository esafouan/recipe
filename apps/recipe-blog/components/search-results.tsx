'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RecipeCard } from '@/components/recipe-card'
import { SearchBar } from '@/components/search-bar'
import { Pagination } from '@/components/pagination'
import { Search, Loader2 } from 'lucide-react'

interface SearchResultsProps {
  query: string
}

const RECIPES_PER_PAGE = 12

export function SearchResults({ query }: SearchResultsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1
  
  const [recipes, setRecipes] = useState<any[]>([])
  const [totalRecipes, setTotalRecipes] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch recipes for current page when query or page changes
  useEffect(() => {
    async function fetchSearchResults() {
      if (!query) {
        setRecipes([])
        setTotalRecipes(0)
        setTotalPages(0)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Fetch only the current page of results
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&page=${currentPage}&limit=${RECIPES_PER_PAGE}`
        )
        if (!response.ok) {
          throw new Error('Search failed')
        }
        const data = await response.json()
        
        setRecipes(data.recipes || [])
        setTotalRecipes(data.total || 0)
        setTotalPages(data.totalPages || 0)
      } catch (err) {
        console.error('Search error:', err)
        setError('We couldn\'t complete your search. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [query, currentPage])

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`, { scroll: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Empty query state
  if (!query) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-6">
          <Search className="h-8 w-8 text-orange-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
          Search Recipes
        </h2>
        <p className="text-gray-600 mb-8">
          Search for ingredients, recipe names, or cooking techniques
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBar placeholder="Try 'soup', 'beef', 'quick meals'..." />
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <PopularSearch term="Soup" />
          <PopularSearch term="Beef" />
          <PopularSearch term="Bread" />
          <PopularSearch term="Quick" />
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Searching recipes...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <Search className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
          Search Error
        </h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>
      </div>
    )
  }

  // No results state
  if (recipes.length === 0 && totalRecipes === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
          No Results Found
        </h2>
        <p className="text-gray-600 mb-4">
          We couldn't find any recipes matching <strong>"{query}"</strong>
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Try searching for different ingredients or recipe names
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>
        <div className="mt-12">
          <h3 className="text-sm font-medium text-gray-500 mb-4">POPULAR SEARCHES</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PopularSearch term="Soup" />
            <PopularSearch term="Beef" />
            <PopularSearch term="Bread" />
            <PopularSearch term="Easy" />
          </div>
        </div>
      </div>
    )
  }

  // Map recipes to the format expected by RecipeCard
  const formattedRecipes = recipes.map((recipe) => ({
    id: recipe.slug || recipe.databaseId?.toString() || Math.random().toString(),
    slug: recipe.slug,
    title: recipe.title,
    image: recipe.images?.[0] || recipe.featuredImage?.sourceUrl,
    featuredImage: recipe.images?.[0] || recipe.featuredImage?.sourceUrl,
    category: recipe.categories?.[0]?.slug || recipe.meta?.difficulty || "Recipe",
    datePublished: recipe.date || new Date().toISOString(),
  }))

  return (
    <div>
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <SearchBar />
      </div>

      {/* Results Count */}
      <div className="mb-8">
        <p className="text-gray-600">
          Showing{' '}
          <strong>
            {((currentPage - 1) * RECIPES_PER_PAGE) + 1}-{Math.min(currentPage * RECIPES_PER_PAGE, totalRecipes)}
          </strong>{' '}
          of <strong>{totalRecipes}</strong> recipe{totalRecipes !== 1 ? 's' : ''} matching{' '}
          <strong>"{query}"</strong>
        </p>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {formattedRecipes.map((recipe) => (
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

function PopularSearch({ term }: { term: string }) {
  return (
    <a
      href={`/search?q=${encodeURIComponent(term)}`}
      className="block p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
    >
      <Search className="h-5 w-5 text-gray-400 mb-2" />
      <span className="text-sm font-medium text-gray-900">{term}</span>
    </a>
  )
}
