"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Users, Star, Search, Filter, Grid, List } from "lucide-react"
import { type BlogRecipe } from "@/lib/types/recipe"

interface RecipeArchiveProps {
  defaultCategory?: string
  recipes?: BlogRecipe[]
  categories?: string[]
}

export function RecipeArchive({ 
  defaultCategory = "all", 
  recipes = [], 
  categories: propCategories = [] 
}: RecipeArchiveProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory)
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const categories = ["all", ...propCategories.filter(cat => cat !== "all")]
  const difficulties = ["all", "Easy", "Medium", "Hard"]

  const filteredAndSortedRecipes = useMemo(() => {
    const filtered = recipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.keywords.some((keyword: string) => keyword.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === "all" || recipe.difficulty === selectedDifficulty

      return matchesSearch && matchesCategory && matchesDifficulty
    })

    // Sort recipes
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "time":
        filtered.sort((a, b) => a.totalTime - b.totalTime)
        break
      case "popular":
        filtered.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      default: // newest
        break
    }

    return filtered
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedDifficulty("all")
    setSortBy("newest")
  }

  return (
    <div className="py-8">
      <div className="container px-4">
        {/* Header */}
        <div className="space-y-6 mb-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-balance">Mini Recipe Collection</h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Discover our complete collection of small-batch recipes designed for 1-2 servings. Perfect portions, zero waste, maximum flavor.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty === "all" ? "All Levels" : difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters} size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="time">Quickest First</SelectItem>
                  </SelectContent>
                </Select>

                <p className="text-sm text-muted-foreground">
                  {filteredAndSortedRecipes.length} recipe{filteredAndSortedRecipes.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Grid/List */}
        {filteredAndSortedRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No recipes found matching your criteria.</p>
            <Button onClick={clearFilters}>Clear all filters</Button>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
            {filteredAndSortedRecipes.map((recipe) =>
              viewMode === "grid" ? (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ) : (
                <RecipeListItem key={recipe.id} recipe={recipe} />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function RecipeCard({ recipe }: { recipe: BlogRecipe }) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-[4/3] overflow-hidden">
        <Image
          src={recipe.image || "/placeholder.svg"}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          width={400}
          height={300}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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
            <span>{recipe.servings} servings</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {recipe.difficulty}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1">
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
  )
}

function RecipeListItem({ recipe }: { recipe: BlogRecipe }) {
  return (
    <Card className="group hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={recipe.image || "/placeholder.svg"}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              width={128}
              height={96}
              sizes="128px"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {recipe.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {recipe.cuisine}
                  </Badge>
                </div>
                <h3 className="font-sans text-xl font-semibold group-hover:text-primary transition-colors">
                  <Link href={`/recipes/${recipe.slug}`}>{recipe.title}</Link>
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{recipe.description}</p>
              </div>

              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-medium">{recipe.rating}</span>
                <span className="text-xs text-muted-foreground">({recipe.reviewCount})</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.totalTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{recipe.servings} servings</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {recipe.difficulty}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-wrap gap-1">
                  {recipe.dietary.slice(0, 2).map((diet: string) => (
                    <Badge key={diet} variant="outline" className="text-xs">
                      {diet}
                    </Badge>
                  ))}
                </div>
                <Button asChild size="sm">
                  <Link href={`/recipes/${recipe.slug}`}>View Recipe</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
