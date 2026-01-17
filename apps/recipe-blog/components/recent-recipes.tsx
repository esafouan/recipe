import Link from "next/link";
import Image from "next/image";
import { getRecentRecipes as getRecentRecipesFromWP, getCategoryLabel } from "@/lib/api";
import { getRecentRecipesConfig } from "@/lib/config";
import { SectionHeader } from "./section-header";

// Simple type for recipe data
type Recipe = {
  id: string;
  slug: string;
  title: string;
  image: string;
  featuredImage?: string;
  category: string;
  datePublished: string;
};

async function getRecentRecipes(): Promise<Recipe[]> {
  try {

    // Fetch recipes from WordPress GraphQL API (already parsed by parseRecipeData)
    const wpRecipes = await getRecentRecipesFromWP(8);

    const recipes = wpRecipes.map((recipe: any) => {
      const image = recipe.images?.[0] ;
      
      return {
        id: recipe.slug || recipe.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        slug: recipe.slug || recipe.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: recipe.title || "Untitled Recipe",
        image: image,
        category: recipe.meta?.difficulty || "Recipe",
        datePublished: recipe.date || new Date().toISOString(),
      };
    });



    return recipes.slice(0, 8);
  } catch (error) {
    console.error("❌ Error fetching recipes from WordPress:", error);
    return [];
  }
}

export async function RecentRecipes() {
  const recipes = await getRecentRecipes();
  const recentRecipesConfig = getRecentRecipesConfig();

  // Always render exactly 8 recipes
  const displayRecipes = recipes.slice(0, 8);

  return (
    <section id="recent-recipes" className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Section Heading with decorative lines */}
        <div className="text-center mb-8 md:mb-12 relative">
          <SectionHeader title={recentRecipesConfig.title} />
        </div>

        {/* Recipe Grid - 2x4 layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          {displayRecipes.map((recipe) => {
            // Get the display label for the category (maps WordPress slug to user-friendly label)
            const categoryLabel = getCategoryLabel(recipe.category);
            
            return (
            <div key={recipe.id} className="group">
              <Link href={`/recipes/${recipe.slug}`} className="block">
                <div className="relative overflow-hidden rounded-xl mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    width={300}
                    height={300}
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    unoptimized={true}
                  />

                  {/* Category Badge - Overlay on image */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full text-gray-700 shadow-sm">
                      {categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Recipe Info */}
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-sm md:text-base text-center text-foreground group-hover:text-primary transition-colors duration-200 leading-tight line-clamp-2">
                    {recipe.title}
                  </h3>

                  {/* Date */}
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground font-medium">
                      {recipe.datePublished
                        ? new Date(recipe.datePublished).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "Recent"}
                    </span>
                  </div>

                  {/* Learn More */}
                  <div className="text-center pt-1">
                    <span className="text-xs md:text-sm text-primary font-medium group-hover:underline transition-all duration-200">
                      View Recipe →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )})}
        </div>
      </div>
    </section>
  );
}
