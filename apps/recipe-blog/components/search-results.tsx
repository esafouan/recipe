"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, Star, Search } from "lucide-react"
import { getAllRecipes, searchRecipes } from "@/lib/recipes-data"
import { type BlogRecipe } from "@/lib/types/recipe"

export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<BlogRecipe[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function performSearch() {
      setIsLoading(true)
      try {
        if (query) {
          const filtered = await searchRecipes(query)
          setResults(filtered)
        } else {
          const allRecipes = await getAllRecipes()
          setResults(allRecipes)
        }
      } catch (error) {
        console.error('Error searching recipes:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [query])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Searching recipes...</p>
        </div>
      </div>
    )
  }

  if (query && results.length === 0) {
    return (
      <div className="text-center space-y-6 py-12">
        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">No recipes found</h3>
          <p className="text-muted-foreground">
            We couldn't find any recipes matching "{query}". Try searching for different ingredients or recipe names.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/recipes">Browse All Recipes</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {query && (
        <div className="text-center">
          <p className="text-muted-foreground">
            Found <span className="font-semibold text-foreground">{results.length}</span> recipes for "{query}"
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {results.map((recipe) => (
          <Card
            key={recipe.id}
            className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <Image
                src={recipe.image || "/placeholder.svg"}
                alt={recipe.title}
                width={400}
                height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {recipe.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-medium">{recipe.rating}</span>
                  <span className="text-xs text-muted-foreground">({recipe.reviewCount})</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-sans text-xl font-semibold text-balance group-hover:text-primary transition-colors">
                  <Link href={`/recipes/${recipe.slug}`}>{recipe.title}</Link>
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{recipe.description}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.totalTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {recipe.difficulty}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                {recipe.dietary.slice(0, 2).map((diet: string) => (
                  <Badge key={diet} variant="outline" className="text-xs">
                    {diet}
                  </Badge>
                ))}
              </div>

              <Button asChild className="w-full">
                <Link href={`/recipes/${recipe.slug}`}>View Recipe</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
