import { CategoriesSection } from "@/components/categories-section"
import { HeroSection } from "@/components/hero-section"
import { FeaturedRecipes } from "@/components/featured-recipes"
import { QuickEasyRecipes } from "@/components/quick-easy-recipes"
import { RecentRecipes } from "@/components/recent-recipes"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { getRecentRecipes } from "@/lib/api"

// Type for transformed recipe
type TransformedRecipe = {
  id: string;
  slug: string;
  title: string;
  image: string;
  category: string;
  datePublished: string;
  prepTime: string;
  cookTime: string;
  totalTimeMinutes: number;
  totalTimeDisplay: string;
};

// Helper function to parse time string to minutes
function parseTimeToMinutes(timeStr: string | undefined): number {
  if (!timeStr) return 0;
  
  const str = timeStr.toLowerCase().trim();
  let totalMinutes = 0;
  
  const hourMatch = str.match(/(\d+)\s*(hours?|hrs?|h)/);
  if (hourMatch) {
    totalMinutes += parseInt(hourMatch[1]) * 60;
  }
  
  const minMatch = str.match(/(\d+)\s*(mins?|minutes?|m)/);
  if (minMatch) {
    totalMinutes += parseInt(minMatch[1]);
  }
  
  if (totalMinutes === 0 && /^\d+$/.test(str)) {
    totalMinutes = parseInt(str);
  }
  
  return totalMinutes;
}

// Format total time for display
function formatTotalTime(totalMinutes: number): string {
  if (totalMinutes >= 60) {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return mins > 0 ? `${hrs} hrs ${mins} mins` : `${hrs} hrs`;
  }
  return `${totalMinutes} mins`;
}

export default async function HomePage() {
  // 🚀 SINGLE API CALL - Fetch all recipes once for the entire homepage
  const allRecipes = await getRecentRecipes(30);

  // Transform recipes to the format used by components
  const transformedRecipes: TransformedRecipe[] = allRecipes.map((recipe: any) => {
    const image = recipe.images?.[0];
    const prepTimeStr = recipe.meta?.prepTime || "";
    const cookTimeStr = recipe.meta?.cookTime || "";
    
    const prepMinutes = parseTimeToMinutes(prepTimeStr);
    const cookMinutes = parseTimeToMinutes(cookTimeStr);
    const totalMinutes = prepMinutes + cookMinutes;
    
    let displayTime = "";
    if (totalMinutes > 0) {
      displayTime = formatTotalTime(totalMinutes);
    } else if (prepTimeStr) {
      displayTime = prepTimeStr;
    } else if (cookTimeStr) {
      displayTime = cookTimeStr;
    }
    
    return {
      id: recipe.slug || recipe.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      slug: recipe.slug || recipe.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: recipe.title || "Untitled Recipe",
      image: image,
      category: recipe.meta?.difficulty || "Recipe",
      datePublished: recipe.date || new Date().toISOString(),
      prepTime: prepTimeStr,
      cookTime: cookTimeStr,
      totalTimeMinutes: totalMinutes,
      totalTimeDisplay: displayTime,
    };
  });

  // 📦 DISTRIBUTE DATA TO SECTIONS (no overlap)
  
  // Editor's Picks: First 4 recipes
  const featuredRecipes = transformedRecipes.slice(0, 4);
  
  // Quick & Easy: From remaining recipes, filter for ≤60 min, take up to 6
  const remainingAfterFeatured = transformedRecipes.slice(4);
  const quickRecipes = remainingAfterFeatured
    .filter((r) => r.totalTimeMinutes > 0 && r.totalTimeMinutes <= 60)
    .sort((a, b) => a.totalTimeMinutes - b.totalTimeMinutes)
    .slice(0, 6);
  
  // Track which slugs are used in Quick & Easy
  const quickRecipeSlugs = new Set(quickRecipes.map(r => r.slug));
  
  // Recent Recipes: Take next 8 recipes that aren't in featured or quick
  const recentRecipes = remainingAfterFeatured
    .filter((r) => !quickRecipeSlugs.has(r.slug))
    .slice(0, 8);

  return (
      <>
        {/* Hero Section - Welcome and intro */}
        <HeroSection />
        
        {/* Editor's Picks - Curated featured recipes (first 4) */}
        <FeaturedRecipes recipes={featuredRecipes} />
        
        {/* Browse by Category */}
        <CategoriesSection />
        
        {/* Quick & Easy - Short cook time recipes */}
        <QuickEasyRecipes recipes={quickRecipes} />
        
        {/* Latest Recipes - Most recent additions */}
        <RecentRecipes recipes={recentRecipes} />
        
        {/* Newsletter Signup - User engagement */}
        <NewsletterSignup />
      </>
  )
}
