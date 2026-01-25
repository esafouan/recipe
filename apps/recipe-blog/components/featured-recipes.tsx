import Link from "next/link";
import Image from "next/image";
import { getCategoryLabel } from "@/lib/api";
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

interface FeaturedRecipesProps {
  recipes: Recipe[];
}

export function FeaturedRecipes({ recipes }: FeaturedRecipesProps) {
  if (recipes.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Section Header - matching your design */}
        <div className="text-center mb-8 md:mb-12 relative">
          <SectionHeader title="EDITOR'S PICKS" />
        </div>

        {/* Recipe Grid - 2x2 on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
                      width={300}
                      height={300}
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, 25vw"
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

                    {/* View Recipe Link */}
                    <div className="text-center pt-1">
                      <span className="text-xs md:text-sm text-primary font-medium group-hover:underline transition-all duration-200">
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
