import Link from "next/link";
import Image from "next/image";
import { getRecentRecipes, getCategoryLabel } from "@/lib/api";
import { SectionHeader } from "./section-header";

// Type for recipe data
type Recipe = {
  id: string;
  slug: string;
  title: string;
  image: string;
  category: string;
  datePublished: string;
};

async function getTrendingRecipes(): Promise<Recipe[]> {
  try {
    // Get more recipes and pick a diverse selection
    const wpRecipes = await getRecentRecipes(16);

    const recipes = wpRecipes.map((recipe: any) => {
      const image = recipe.images?.[0];
      
      return {
        id: recipe.slug || recipe.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        slug: recipe.slug || recipe.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: recipe.title || "Untitled Recipe",
        image: image,
        category: recipe.meta?.difficulty || "Recipe",
        datePublished: recipe.date || new Date().toISOString(),
      };
    });

    // Skip the first 4 (used for featured) and take the next 6 for trending
    return recipes.slice(4, 10);
  } catch (error) {
    console.error("❌ Error fetching trending recipes:", error);
    return [];
  }
}

export async function TrendingRecipes() {
  const recipes = await getTrendingRecipes();

  if (recipes.length < 3) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Section Header - matching your design */}
        <div className="text-center mb-8 md:mb-12 relative">
          <SectionHeader title="POPULAR RECIPES" />
        </div>

        {/* Recipe Grid - 2x3 on mobile, 6 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {recipes.map((recipe) => {
            const categoryLabel = getCategoryLabel(recipe.category);
            
            return (
              <div key={recipe.id} className="group">
                <Link href={`/recipes/${recipe.slug}`} className="block">
                  <div className="relative overflow-hidden rounded-xl mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                      width={200}
                      height={200}
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />

                    {/* Category Badge - Overlay on image */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-white/90 backdrop-blur-sm text-[10px] md:text-xs font-medium px-2 py-0.5 rounded-full text-gray-700 shadow-sm">
                        {categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Recipe Info */}
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-xs md:text-sm text-center text-foreground group-hover:text-primary transition-colors duration-200 leading-tight line-clamp-2">
                      {recipe.title}
                    </h3>

                    {/* View Recipe Link */}
                    <div className="text-center">
                      <span className="text-xs text-primary font-medium group-hover:underline transition-all duration-200">
                        View Recipe →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
