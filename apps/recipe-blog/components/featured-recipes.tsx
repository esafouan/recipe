"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, Heart, Bookmark, ArrowRight, Leaf } from "lucide-react"
import { getFeaturedRecipes } from "@/lib/recipes-data"
import { type BlogRecipe } from "@/lib/types/recipe"

// Static fallback data for immediate render
const fallbackRecipes = [
  {
    id: "1",
    slug: "single-serve-creamy-pasta",
    title: "Single-Serve Creamy Pasta",
    name: "Single-Serve Creamy Pasta",
    description: "Perfect portion pasta with garlic parmesan sauce - no leftovers, maximum flavor in just one serving.",
    image: "/creamy-pasta-dish-with-herbs.jpg",
    category: "Dinner",
    prepTime: 15,
    servings: 1,
    rating: 4.9,
    difficulty: "Easy" as const,
    dietary: ["Vegetarian"],
  },
  {
    id: "2",
    slug: "mini-chocolate-chip-cookies",
    title: "Mini Chocolate Chip Cookies",
    name: "Mini Chocolate Chip Cookies",
    description: "Small batch recipe makes just 6 perfect cookies - ideal for satisfying cravings without waste.",
    image: "/chocolate-chip-cookies-golden-brown.jpg",
    category: "Dessert",
    prepTime: 12,
    servings: 6,
    rating: 4.8,
    difficulty: "Easy" as const,
    dietary: ["Vegetarian"],
  },
  {
    id: "3",
    slug: "personal-quinoa-power-bowl",
    title: "Personal Quinoa Power Bowl",
    name: "Personal Quinoa Power Bowl",
    description: "One-bowl wonder packed with nutrients and flavor - perfectly portioned for busy women on-the-go.",
    image: "/mediterranean-quinoa-bowl-colorful-vegetables.jpg",
    category: "Healthy",
    prepTime: 18,
    servings: 1,
    rating: 4.9,
    difficulty: "Easy" as const,
    dietary: ["Healthy", "Vegetarian"],
  },
]

export function FeaturedRecipes() {
  const [recipes, setRecipes] = useState<BlogRecipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeaturedRecipes() {
      try {
        const featuredRecipes = await getFeaturedRecipes(3)
        setRecipes(featuredRecipes)
      } catch (error) {
        console.error('Error loading featured recipes:', error)
        // Set empty array on error
        setRecipes([])
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedRecipes()
  }, [])

  // Don't show fallback recipes while loading anymore
  const displayRecipes = loading ? [] : recipes

  // If no recipes to display, don't render the section
  if (!loading && displayRecipes.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-background via-card/20 to-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center space-y-4 md:space-y-6 mb-12 md:mb-16">
          <div className="flex justify-center">
            <Badge
              variant="secondary"
              className="text-xs md:text-sm font-semibold px-4 md:px-5 py-2 bg-secondary text-white border-secondary/30 rounded-full inline-flex items-center"
            >
              <Leaf className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              Zero Waste Favorites
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-balance mini-recipe-gradient">
            Perfect Portions, Perfect Flavor
          </h2>
          <p className="text-base md:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            Our most loved mini recipes designed for busy women who want delicious meals without the waste or leftovers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12 max-w-6xl mx-auto">
          {displayRecipes.map((recipe: BlogRecipe) => (
            <Card
              key={recipe.id}
              className="group overflow-hidden recipe-card-hover border-0 feminine-shadow bg-card/80 backdrop-blur-sm"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <Image
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  width={400}
                  height={300}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-3 md:top-4 right-3 md:right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-9 h-9 md:w-10 md:h-10 p-0 rounded-full bg-white/95 hover:bg-white shadow-lg"
                  >
                    <Heart className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-9 h-9 md:w-10 md:h-10 p-0 rounded-full bg-white/95 hover:bg-white shadow-lg"
                  >
                    <Bookmark className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  </Button>
                </div>

                <div className="absolute top-3 md:top-4 left-3 md:left-4 flex gap-2">
                  {recipe.rating >= 4.8 && (
                    <Badge className="bg-primary text-white rounded-full shadow-lg text-xs">Popular</Badge>
                  )}
                  {recipe.dietary.includes('Healthy') && (
                    <Badge className="bg-secondary text-white rounded-full shadow-lg text-xs">
                      <Leaf className="w-2 h-2 md:w-3 md:h-3 mr-1" />
                      Eco
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs font-semibold px-2 md:px-3 py-1 rounded-full bg-muted">
                    {recipe.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 md:h-4 md:w-4 fill-primary text-primary" />
                    <span className="text-xs md:text-sm font-semibold">{recipe.rating}</span>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <h3 className="font-serif text-lg md:text-xl font-bold text-balance group-hover:text-primary transition-colors leading-tight">
                    <Link href={`/recipes/${recipe.slug}`}>{recipe.title}</Link>
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{recipe.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs md:text-sm">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="font-medium">{recipe.prepTime} min</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="font-medium">
                        {recipe.servings} serving{recipe.servings > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs font-semibold rounded-full">
                    {recipe.difficulty}
                  </Badge>
                </div>

                <Button
                  asChild
                  className="w-full rounded-full font-semibold bg-primary hover:bg-primary/90 text-sm md:text-base py-2 md:py-3"
                >
                  <Link href={`/recipes/${recipe.slug}`}>Get Recipe</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center px-4">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-6 md:px-8 py-4 md:py-6 rounded-full border-2 border-primary/30 hover:bg-primary/5 hover:border-primary/50 font-semibold bg-transparent w-full max-w-sm md:w-auto"
          >
            <Link href="/recipes">
              Explore All Mini Recipes
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
