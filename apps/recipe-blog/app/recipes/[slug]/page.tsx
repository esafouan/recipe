import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { RecipeDetail } from "@/components/recipe-detail"
import { RecipeSchema } from "@/components/recipe-schema"
import { getRecipe, getRecentRecipes } from "@/lib/api"
import { RecipeData } from "@/lib/recipes-data"

interface RecipePageProps {
  params: Promise<{
    slug: string
  }>
}

// Helper function to convert WordPress data to RecipeData format
function convertWpToRecipeData(wpData: any): RecipeData | null {
  if (!wpData) return null;
  
  // Get the primary image (first image or fallback)
  const primaryImage = wpData.images?.[0] || '/Yay-Recipes-84-1.webp';
  
  // Parse instructions from WordPress format to numbered format
  const instructions = wpData.instructions?.map((inst: any, index: number) => ({
    stepNumber: index + 1,
    name: `Step ${index + 1}`,
    text: inst.description || inst.item || ''
  })) || [];
  
  // Ensure difficulty is a string
  const difficulty = String(wpData.meta?.difficulty || 'Medium');
  
  // Ensure dietary is a string, then wrap in array
  const dietaryValue = wpData.meta?.dietary ? String(wpData.meta.dietary) : '';
  const dietary = dietaryValue ? [dietaryValue] : [];

  return {
    metadata: {
      name: wpData.title || '',
      description: wpData.excerpt?.replace(/<[^>]*>/g, '') || '',
      datePublished: wpData.date || new Date().toISOString(),
      dateModified: wpData.modified || new Date().toISOString(),
      prepTime: wpData.meta?.prepTime || 'PT15M',
      cookTime: wpData.meta?.cookTime || 'PT30M',
      totalTime: 'PT45M',
      recipeYield: '4',
      recipeCategory: dietaryValue || 'Main Dish',
      recipeCuisine: 'International',
      difficulty: difficulty,
      dietary: dietary,
      keywords: wpData.title || '',
      images: wpData.images?.length > 0 ? wpData.images : [primaryImage]
    },
    introduction: wpData.content?.substring(0, 300) || wpData.excerpt?.replace(/<[^>]*>/g, '') || '',
    whyYouLlLove: wpData.whyLove?.map((item: any) => item.item || item.description || '') || [],
    authorStory: wpData.content || '',
    ingredients: wpData.ingredients?.map((ing: any) => ({
      item: ing.item || '',
      description: ing.description || ''
    })) || [],
    instructions,
    youMustKnow: [],
    personalNote: '',
    storage: wpData.storageSection || { title: 'Storage', content: '' },
    substitutions: wpData.subsSection || { title: 'Substitutions', content: '' },
    servingSuggestions: { title: 'Serving Suggestions', content: '' },
    proTips: wpData.tools?.map((tool: any) => tool.item || tool.description || '') || [],
    closingThought: '',
    faqs: [],
    tools: wpData.tools?.map((tool: any) => tool.item || tool.description || '') || [],
    notes: []
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params
  
  // Fetch recipe from WordPress
  const wpRecipeData = await getRecipe(slug)
  
  if (!wpRecipeData) {
    notFound()
  }
  
  // Convert to RecipeData format
  const recipe = convertWpToRecipeData(wpRecipeData)
  
  if (!recipe) {
    notFound()
  }
  
  // Get category information for breadcrumbs
  const categorySlug = wpRecipeData.categories?.[0]?.slug || null
  const categoryName = wpRecipeData.categories?.[0]?.name || null

  // Fetch related recipes from WordPress
  let relatedRecipes: Array<{
    id: string
    title: string
    image: string
    slug: string
  }> = []

  try {
    const allRecipes = await getRecentRecipes(8)
    
    const filteredRelated = allRecipes
      .filter((r: any) => r.slug !== slug)
      .slice(0, 4)
      .map((r: any) => ({
        id: r.slug,
        title: r.title,
        image: r.images?.[0] || '/Yay-Recipes-84-1.webp',
        slug: r.slug
      }))
    
    relatedRecipes = filteredRelated
  } catch (error) {
    console.warn('Could not fetch related recipes:', error)
    // relatedRecipes will remain empty array, component will use defaults
  }

  return (
    <div className="min-h-screen flex flex-col">
      <RecipeSchema recipe={recipe} />
      <main className="flex-1">
        <RecipeDetail 
          recipe={recipe} 
          relatedRecipes={relatedRecipes}
          categorySlug={categorySlug}
          categoryName={categoryName}
        />
      </main>
    </div>
  )
}
