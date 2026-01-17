import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { RecipeDetail } from "@/components/recipe-detail"
import { RecipeSchema } from "@/components/recipe-schema"
import { getRecipe, getRecentRecipes } from "@/lib/api"
import { RecipeData } from "@/lib/recipes-data"

// Helper function to strip HTML tags and clean text
function stripHtml(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

// 1. Tell Next.js to pre-build these pages
export async function generateStaticParams() {
  const query = `
    query GetAllSlugs {
      recipes(first: 1000) {
        nodes {
          slug
        }
      }
    }
  `;
  
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    
    if (!res.ok) {
      console.error('Failed to fetch recipe slugs for static generation');
      return [];
    }
    
    const json = await res.json();
    const recipes = json.data?.recipes?.nodes || [];


    return recipes.map((recipe: { slug: string }) => ({
      slug: recipe.slug,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

// 2. Enable ISR (Incremental Static Regeneration)
// This updates the page if you edit the recipe in WP, without rebuilding the whole site
export const revalidate = 60; // Check for updates every 60 seconds

interface RecipePageProps {
  params: Promise<{
    slug: string
  }>
}

// 3. Generate metadata for SEO (using Rank Math data from WordPress)
export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const wpRecipeData = await getRecipe(slug);
    
    if (!wpRecipeData) {
      return {
        title: 'Recipe Not Found',
        description: 'The recipe you are looking for could not be found.',
      };
    }

    // TITLE PRIORITY: Rank Math SEO title -> WordPress title
    const title = wpRecipeData.seo?.title || wpRecipeData.title || 'Recipe';
    
    // DESCRIPTION PRIORITY: Rank Math description -> Stripped content (160 chars)
    const rankMathDesc = wpRecipeData.seo?.description;
    const strippedContent = stripHtml(wpRecipeData.content);
    
    const description = rankMathDesc 
      || strippedContent.substring(0, 160)
      || '';
    
    // IMAGES: Use all available images from WordPress
    // Image 1: Main recipe image (for Pinterest & social)
    // Image 2: Ingredients image
    // Image 3: Recipe in progress image
    const mainImage = wpRecipeData.images?.[0] || wpRecipeData.featuredImage?.sourceUrl ;
    const ingredientsImage = wpRecipeData.images?.[1];
    const processImage = wpRecipeData.images?.[2];
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cozybiteskitchen.com';

    // Open Graph - use Rank Math OG fields if available
    const ogTitle = wpRecipeData.seo?.openGraph?.title || title;
    const ogDescription = wpRecipeData.seo?.openGraph?.description || description;
    
    // Twitter - fallback to regular description
    const twitterTitle = title;
    const twitterDescription = description;
    
    // Keywords - use Rank Math focus keywords if available
    const keywords = wpRecipeData.seo?.focusKeywords 
      || wpRecipeData.categories?.map((cat: any) => cat.name).join(', ') 
      || '';

    // Build Open Graph images array with all available images
    const ogImages = [
      // Primary image - optimized for Pinterest (vertical 2:3 ratio preferred)
      {
        url: mainImage,
        width: 1000,
        height: 1500,
        alt: title,
      },
      // Secondary image for horizontal displays
      {
        url: mainImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    ];

    // Add ingredients and process images if available
    if (ingredientsImage) {
      ogImages.push({
        url: ingredientsImage,
        width: 1000,
        height: 1500,
        alt: `${title} - Ingredients`,
      });
    }
    
    if (processImage) {
      ogImages.push({
        url: processImage,
        width: 1000,
        height: 1500,
        alt: `${title} - Cooking Process`,
      });
    }

    return {
      title: `${title} - Cozy Bites Kitchen`,
      description,
      keywords,
      authors: [{ name: 'Cozy Bites Kitchen' }],
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        type: 'article',
        url: `${baseUrl}/recipes/${slug}`,
        images: ogImages,
        publishedTime: wpRecipeData.date,
        modifiedTime: wpRecipeData.modified,
        siteName: 'Cozy Bites Kitchen',
      },
      twitter: {
        card: 'summary_large_image',
        title: twitterTitle,
        description: twitterDescription,
        images: [mainImage],
        creator: '@cozybiteskitchen',
        site: '@cozybiteskitchen',
      },
      other: {
        // Pinterest-specific meta tags
        'pinterest:description': description,
        'pinterest:media': mainImage,
        // Rich Pins for Recipes
        'og:type': 'article',
        'article:author': 'Cozy Bites Kitchen',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Recipe - Cozy Bites Kitchen',
      description: 'Discover delicious recipes on Cozy Bites Kitchen',
    };
  }
}

// Helper function to convert WordPress data to RecipeData format
function convertWpToRecipeData(wpData: any): RecipeData | null {
  if (!wpData) return null;
  
  // Get the primary image (first image or fallback)
  const primaryImage = wpData.images?.[0] ;
  
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

  // INTRODUCTION PRIORITY: Rank Math description -> Stripped content (300 chars)
  const rankMathDesc = wpData.seo?.description;
  const strippedContent = stripHtml(wpData.content);
  
  const introduction = rankMathDesc 
    || strippedContent.substring(0, 300)
    || '';

  return {
    metadata: {
      name: wpData.title || '',
      description: stripHtml(wpData.content).substring(0, 160) || '',
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
    introduction,
    whyYouLlLove: wpData.whyLove?.map((item: any) => item.item || item.description || '') || [],
    authorStory: stripHtml(wpData.content) || '',
    contentHtml: wpData.content || '', // Pass raw HTML without stripping tags
    ingredients: wpData.ingredients?.map((ing: any) => ({
      item: ing.item || '',
      description: ing.description || ''
    })) || [],
    instructions,
    youMustKnow: [], // Keep empty for now - add WordPress field if needed
    personalNote: '',
    storage: wpData.storageSection 
      ? { title: wpData.storageSection.title || 'Storage', content: stripHtml(wpData.storageSection.content) || '' }
      : { title: 'Storage', content: '' },
    substitutions: wpData.subsSection 
      ? { title: wpData.subsSection.title || 'Substitutions', content: stripHtml(wpData.subsSection.content) || '' }
      : { title: 'Substitutions', content: '' },
    servingSuggestions: { title: 'Serving Suggestions', content: '' },
    proTips: [], // Keep empty for now - add WordPress field if needed
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
        image: r.images?.[0],
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
