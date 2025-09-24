"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, ChefHat, Star, Printer, Share2, Heart, Utensils } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

interface Recipe {
  id: string
  name: string
  title?: string // Add title for compatibility
  description: string
  content?: string // Blog content for better engagement
  image: string
  prepTime: string
  cookTime: string
  totalTime: string
  recipeYield: string
  recipeCategory: string
  recipeCuisine: string
  keywords: string[]
  author: {
    "@type": string
    name: string
  }
  datePublished: string
  recipeIngredient: string[]
  recipeInstructions: Array<{
    "@type": string
    text: string
  }>
  nutrition: {
    "@type": string
    calories: string
    proteinContent: string
    carbohydrateContent: string
    fatContent: string
    fiberContent: string
    sodiumContent: string
  }
  aggregateRating: {
    "@type": string
    ratingValue: string
    reviewCount: string
  }
  difficulty: string
  equipment: string[]
  tips: string[]
  // Additional engagement fields
  notes?: string
  faqs?: Array<{
    question: string
    answer: string
  }>
  dietary?: string[]
  cuisine?: string
}

interface RecipeDetailProps {
  recipe: Recipe
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const [servings, setServings] = useState(4)
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedIngredients(newChecked)
  }

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(index)) {
      newCompleted.delete(index)
    } else {
      newCompleted.add(index)
    }
    setCompletedSteps(newCompleted)
  }

  const formatTime = (duration: string) => {
    const match = duration.match(/PT(\d+)M/)
    return match ? `${match[1]} min` : duration
  }

  return (
    <article className="py-8">
      <div className="container px-4 max-w-4xl">
        {/* Recipe Header */}
        <header className="space-y-6 mb-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <span>/</span>
            <a href="/recipes" className="hover:text-foreground transition-colors">Recipes</a>
            <span>/</span>
            <a href={`/categories/${recipe.recipeCategory.toLowerCase()}`} className="hover:text-foreground transition-colors">{recipe.recipeCategory}</a>
            <span>/</span>
            <span className="text-foreground">{recipe.name}</span>
          </nav>

          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="sr-only">Recipe categories:</span>
              <Badge variant="secondary">{recipe.recipeCategory}</Badge>
              <Badge variant="outline">{recipe.recipeCuisine}</Badge>
              <Badge variant="outline">{recipe.difficulty}</Badge>
              {/* Add dietary badges for better SEO and user info */}
              {recipe.dietary?.map((diet, index) => (
                <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {diet}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl lg:text-4xl font-sans font-bold text-balance">{recipe.name}</h1>

            <p className="text-lg text-muted-foreground leading-relaxed">{recipe.description}</p>

            {/* Add content section for better SEO and engagement */}
            {recipe.content && (
              <div className="prose prose-gray max-w-none mb-6">
                <div className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg border-l-4 border-primary" dangerouslySetInnerHTML={{ __html: recipe.content }} />
              </div>
            )}

            {/* Enhanced metadata with keywords for SEO */}
            <div className="flex items-center gap-6 text-sm flex-wrap mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                <span className="font-medium" itemProp="ratingValue">{recipe.aggregateRating.ratingValue}</span>
                <span className="text-muted-foreground">
                  (<span itemProp="reviewCount">{recipe.aggregateRating.reviewCount}</span> reviews)
                </span>
              </div>
              <div className="text-muted-foreground">
                By <span itemProp="author" className="font-medium">{recipe.author.name}</span>
              </div>
              <time className="text-muted-foreground" dateTime={recipe.datePublished}>
                Published {new Date(recipe.datePublished).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
              {recipe.cuisine && recipe.cuisine !== recipe.recipeCuisine && (
                <span className="text-muted-foreground">
                  Cuisine: <span className="font-medium">{recipe.cuisine}</span>
                </span>
              )}
            </div>

            {/* Add keywords section for SEO */}
            {recipe.keywords && recipe.keywords.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-muted-foreground">Tags:</span>
                {recipe.keywords.map((keyword, index) => (
                  <span 
                    key={index} 
                    className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recipe Image and Info */}
          <div className="lg:col-span-2 space-y-8">
            <figure className="aspect-video rounded-xl overflow-hidden">
              <Image 
                src={recipe.image || "/placeholder.svg"} 
                alt={`${recipe.name} - ${recipe.description}`}
                className="w-full h-full object-cover" 
                itemProp="image"
                priority={true}
                width={800}
                height={450}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
              <figcaption className="sr-only">{recipe.name} recipe image</figcaption>
            </figure>

            {/* Recipe Meta */}
            <section className="recipe-meta" itemScope itemType="https://schema.org/Recipe">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center space-y-2">
                      <Clock className="h-6 w-6 text-primary mx-auto" aria-hidden="true" />
                      <div>
                        <p className="font-medium">Prep Time</p>
                        <p className="text-sm text-muted-foreground">
                          <time itemProp="prepTime" dateTime={recipe.prepTime}>
                            {formatTime(recipe.prepTime)}
                          </time>
                        </p>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <ChefHat className="h-6 w-6 text-primary mx-auto" aria-hidden="true" />
                      <div>
                        <p className="font-medium">Cook Time</p>
                        <p className="text-sm text-muted-foreground">
                          <time itemProp="cookTime" dateTime={recipe.cookTime}>
                            {formatTime(recipe.cookTime)}
                          </time>
                        </p>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <Users className="h-6 w-6 text-primary mx-auto" aria-hidden="true" />
                      <div>
                        <p className="font-medium">Servings</p>
                        <p className="text-sm text-muted-foreground">
                          <span itemProp="recipeYield">{recipe.recipeYield}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <Utensils className="h-6 w-6 text-primary mx-auto" aria-hidden="true" />
                      <div>
                        <p className="font-medium">Difficulty</p>
                        <p className="text-sm text-muted-foreground">{recipe.difficulty}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <Button variant="outline" size="sm" type="button" className="flex items-center gap-2">
                      <Printer className="h-4 w-4" aria-hidden="true" />
                      Print Recipe
                    </Button>
                    <Button variant="outline" size="sm" type="button" className="flex items-center gap-2">
                      <Share2 className="h-4 w-4" aria-hidden="true" />
                      Share Recipe
                    </Button>
                    <Button variant="outline" size="sm" type="button" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" aria-hidden="true" />
                      Save Recipe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Recipe Instructions with enhanced UX */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-primary" />
                    Recipe Instructions
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Follow these step-by-step instructions for best results</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ol className="space-y-4" itemProp="recipeInstructions">
                    {recipe.recipeInstructions.map((instruction, index) => (
                      <li key={index} className="flex gap-4" itemProp="recipeInstruction" itemScope itemType="https://schema.org/HowToStep">
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => toggleStep(index)}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                              completedSteps.has(index)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-muted-foreground hover:border-primary"
                            }`}
                            aria-label={`Mark step ${index + 1} as ${completedSteps.has(index) ? 'incomplete' : 'complete'}`}
                            type="button"
                          >
                            {index + 1}
                          </button>
                        </div>
                        <div className="flex-1">
                          <p
                            className={`leading-relaxed ${completedSteps.has(index) ? "line-through text-muted-foreground" : ""}`}
                            itemProp="text"
                          >
                            {instruction.text}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </section>





            {/* FAQ Section for better SEO and user engagement */}
            {recipe.faqs && recipe.faqs.length > 0 && (
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-sans">Frequently Asked Questions</CardTitle>
                    <p className="text-sm text-muted-foreground">Everything you need to know about this recipe</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
                      {recipe.faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0" itemScope itemType="https://schema.org/Question">
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-start gap-2" itemProp="name">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5 flex-shrink-0">
                              Q{index + 1}
                            </span>
                            {faq.question}
                          </h3>
                          <div className="ml-8" itemScope itemType="https://schema.org/Answer">
                            <p className="text-gray-700 leading-relaxed" itemProp="text">{faq.answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Recipe Variations / Tips Section */}
            {recipe.tips && recipe.tips.length > 0 && (
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-sans">Pro Tips & Variations</CardTitle>
                    <p className="text-sm text-muted-foreground">Make this recipe your own with these expert suggestions</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {recipe.tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                          <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center mt-0.5 flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-sm leading-relaxed text-gray-700">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ingredients */}
            <aside>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="font-sans">Recipe Ingredients</CardTitle>
                  <div className="flex items-center gap-2">
                    <label htmlFor="servings-input" className="text-sm text-muted-foreground">Servings:</label>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setServings(Math.max(1, servings - 1))}
                        aria-label="Decrease servings"
                        type="button"
                      >
                        -
                      </Button>
                      <span className="w-8 text-center" id="servings-input">{servings}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setServings(servings + 1)}
                        aria-label="Increase servings"
                        type="button"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3" itemProp="recipeIngredient">
                    {recipe.recipeIngredient.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <button
                          onClick={() => toggleIngredient(index)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
                            checkedIngredients.has(index)
                              ? "bg-primary border-primary"
                              : "border-muted-foreground hover:border-primary"
                          }`}
                          aria-label={`Mark ${ingredient} as ${checkedIngredients.has(index) ? 'not used' : 'used'}`}
                          type="button"
                        >
                          {checkedIngredients.has(index) && (
                            <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                        <span
                          className={`text-sm leading-relaxed ${checkedIngredients.has(index) ? "line-through text-muted-foreground" : ""}`}
                          itemProp="recipeIngredient"
                        >
                          {ingredient}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </aside>

            {/* Enhanced Nutrition Facts with better visual design */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-primary" />
                    Nutrition Facts
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Per serving • Values are approximate</p>
                </CardHeader>
                <CardContent itemScope itemType="https://schema.org/NutritionInformation">
                  {/* Main calorie display */}
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 mb-6 border border-primary/20">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2" itemProp="calories">
                        {recipe.nutrition.calories}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">Calories per serving</div>
                    </div>
                  </div>
                  
                  {/* Macronutrients grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600 mb-1" itemProp="proteinContent">
                          {recipe.nutrition.proteinContent}
                        </div>
                        <div className="text-xs text-blue-700 font-medium">Protein</div>
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600 mb-1" itemProp="carbohydrateContent">
                          {recipe.nutrition.carbohydrateContent}
                        </div>
                        <div className="text-xs text-orange-700 font-medium">Carbs</div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600 mb-1" itemProp="fatContent">
                          {recipe.nutrition.fatContent}
                        </div>
                        <div className="text-xs text-yellow-700 font-medium">Fat</div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600 mb-1" itemProp="fiberContent">
                          {recipe.nutrition.fiberContent}
                        </div>
                        <div className="text-xs text-green-700 font-medium">Fiber</div>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600 mb-1" itemProp="sodiumContent">
                          {recipe.nutrition.sodiumContent}
                        </div>
                        <div className="text-xs text-red-700 font-medium">Sodium</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dietary information */}
                  {recipe.dietary && recipe.dietary.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Dietary Information</h4>
                      <div className="flex flex-wrap gap-2">
                        {recipe.dietary.map((diet, index) => (
                          <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                            {diet}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Enhanced Equipment Section */}
            {recipe.equipment && recipe.equipment.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-primary" />
                    Equipment Needed
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Tools that will help you make this recipe perfectly</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {recipe.equipment.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recipe Storage & Reheating Tips */}
            {recipe.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">Storage & Serving Tips</CardTitle>
                  <p className="text-sm text-muted-foreground">Make the most of your delicious creation</p>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed m-0">{recipe.notes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Bottom engagement section */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center space-y-6">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Did you make this recipe?</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We'd love to hear how it turned out! Tag us on social media or leave a comment below with your experience and any modifications you made.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Button variant="default" size="lg" className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Rate this Recipe
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share your Photo
                </Button>
              </div>
            </div>
            
            {/* Recipe tags for better discoverability */}
            {recipe.keywords && recipe.keywords.length > 0 && (
              <div className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipe Tags</h3>
                <div className="flex items-center justify-center gap-2 flex-wrap max-w-4xl mx-auto">
                  {recipe.keywords.map((keyword, index) => (
                    <a 
                      key={index}
                      href={`/search?q=${encodeURIComponent(keyword)}`}
                      className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      #{keyword}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </article>
  )
}
