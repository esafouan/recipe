import { searchRecipes } from "@/lib/api"
import { RecipeCard } from "@/components/recipe-card"
import { SearchBar } from "@/components/search-bar"
import { Search } from "lucide-react"

interface SearchResultsProps {
  query: string
}

export async function SearchResults({ query }: SearchResultsProps) {
  if (!query) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-6">
          <Search className="h-8 w-8 text-orange-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
          Search Mini Recipes
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

  let recipes: any[] = []
  let error = null

  try {
    recipes = await searchRecipes(query, 20)
  } catch (e) {
    error = e
    console.error("Search error:", e)
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <Search className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
          Search Error
        </h2>
        <p className="text-gray-600 mb-8">
          We couldn't complete your search. Please try again.
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>
      </div>
    )
  }

  if (recipes.length === 0) {
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
    image: recipe.images?.[0] || recipe.featuredImage?.sourceUrl || "/Yay-Recipes-84-1.webp",
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
          Found <strong>{recipes.length}</strong> recipe{recipes.length !== 1 ? 's' : ''} matching{" "}
          <strong>"{query}"</strong>
        </p>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {formattedRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
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
