import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { RecipeDetail } from "@/components/recipe-detail"
import { RecipeSchema } from "@/components/recipe-schema"
import { getRecipeBySlug, getAllRecipes } from "@/lib/recipes-data"

interface RecipePageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const recipes = await getAllRecipes()
  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }))
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const recipe = await getRecipeBySlug(params.slug)

  if (!recipe) {
    return {
      title: "Recipe Not Found - Mini Recipe",
    }
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.name,
    description: recipe.description,
    image: recipe.image,
    author: recipe.author,
    datePublished: recipe.datePublished,
    prepTime: recipe.prepTimeISO,
    cookTime: recipe.cookTimeISO,
    totalTime: recipe.totalTimeISO,
    recipeYield: recipe.recipeYield,
    recipeCategory: recipe.recipeCategory,
    recipeCuisine: recipe.recipeCuisine,
    keywords: recipe.keywords.join(", "),
    recipeIngredient: recipe.recipeIngredient,
    recipeInstructions: recipe.recipeInstructions,
    nutrition: recipe.nutrition,
    aggregateRating: recipe.aggregateRating,
  }

  // Enhanced SEO metadata with absolute URLs and comprehensive data
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://minirecipe.net'
  const imageUrl = recipe.image.startsWith('http') ? recipe.image : `${baseUrl}${recipe.image}`
  const canonicalUrl = `${baseUrl}/recipes/${recipe.slug}`

  return {
    title: `${recipe.title} - Mini Recipe | Small Batch Recipes for 1-2 People`,
    description: `${recipe.description} Ready in ${recipe.totalTime} minutes. Serves ${recipe.servings}. ${recipe.difficulty} difficulty. ${recipe.category} recipe with ${recipe.keywords.slice(0, 3).join(', ')}.`,
    keywords: [...recipe.keywords, 'mini recipe', 'small batch', 'cooking for one', 'cooking for two', recipe.category.toLowerCase(), recipe.difficulty.toLowerCase()].join(", "),
    authors: [{ name: recipe.author.name }],
    creator: recipe.author.name,
    publisher: "Mini Recipe",
    openGraph: {
      title: `${recipe.title} - Perfect for Small Portions`,
      description: `${recipe.description} Quick ${recipe.category.toLowerCase()} recipe ready in ${recipe.totalTime} minutes.`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${recipe.title} - ${recipe.description}`,
          type: 'image/jpeg',
        },
        {
          url: imageUrl,
          width: 1200,
          height: 900,
          alt: `${recipe.title} recipe image`,
          type: 'image/jpeg',
        }
      ],
      type: "article",
      siteName: "Mini Recipe",
      locale: "en_US",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `${recipe.title} - Mini Recipe`,
      description: `${recipe.description} Ready in ${recipe.totalTime} minutes!`,
      images: [imageUrl],
      creator: "@minirecipe",
      site: "@minirecipe",
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      "article:author": recipe.author.name,
      "article:published_time": recipe.datePublished,
      "article:modified_time": recipe.datePublished, // Add updatedAt field to recipe data later
      "article:section": recipe.category,
      "article:tag": recipe.keywords.join(','),
      "recipe:prep_time": recipe.prepTime.toString(),
      "recipe:cook_time": recipe.cookTime.toString(),
      "recipe:total_time": recipe.totalTime.toString(),
      "recipe:servings": recipe.servings?.toString() || recipe.recipeYield,
      "recipe:category": recipe.category,
      "recipe:cuisine": recipe.recipeCuisine,
      "recipe:difficulty": recipe.difficulty,
      "recipe:rating": recipe.aggregateRating.ratingValue,
      "recipe:rating_count": recipe.aggregateRating.reviewCount,
      "recipe:calories": recipe.nutrition.calories,
    },
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const recipe = await getRecipeBySlug(params.slug)

  if (!recipe) {
    notFound()
  }

  // Convert recipe data to match expected interface - ensure all fields are properly mapped
  const recipeForComponents = {
    id: recipe.id,
    name: recipe.name || recipe.title, // Ensure compatibility with both fields
    title: recipe.title, // Add title field for consistency
    description: recipe.description,
    content: recipe.content, // Blog content for better engagement
    image: recipe.image,
    prepTime: recipe.prepTimeISO,
    cookTime: recipe.cookTimeISO,
    totalTime: recipe.totalTimeISO,
    recipeYield: recipe.recipeYield,
    recipeCategory: recipe.recipeCategory,
    recipeCuisine: recipe.recipeCuisine,
    keywords: recipe.keywords,
    author: recipe.author,
    datePublished: recipe.datePublished,
    recipeIngredient: recipe.recipeIngredient,
    recipeInstructions: recipe.recipeInstructions,
    nutrition: recipe.nutrition,
    aggregateRating: recipe.aggregateRating,
    difficulty: recipe.difficulty,
    equipment: recipe.equipment || [], // Ensure array exists
    tips: recipe.tips || [], // Ensure array exists
    // Enhanced engagement fields
    notes: recipe.notes, // Recipe notes
    faqs: recipe.faqs, // FAQ section for better SEO
    dietary: recipe.dietary, // Dietary restrictions for badges
    cuisine: recipe.cuisine, // Cuisine for additional context
  }

  return (
    <div className="min-h-screen flex flex-col">
      <RecipeSchema recipe={recipeForComponents} />
      <SiteHeader />
      <main className="flex-1">
        <RecipeDetail recipe={recipeForComponents} />
      </main>
      <SiteFooter />
    </div>
  )
}
