import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase/config";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { getRecentRecipes as getRecentRecipesData, RecipeData } from "@/lib/recipes-data";
import { generateSlug } from "@/lib/schema-utils";
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

// Fallback recipes to prevent hydration issues if API fails
const fallbackRecipes = [
  {
    id: "1",
    slug: "single-serve-creamy-pasta",
    title: "Single-Serve Creamy Pasta",
    image: "/Yay-Recipes-84-1.webp",
    category: "Dinner",
    datePublished: "2024-11-05",
  },
  {
    id: "2",
    slug: "mini-chocolate-chip-cookies",
    title: "Mini Chocolate Chip Cookies",
    image: "/Yay-Recipes-84-1.webp",
    category: "Dessert",
    datePublished: "2024-11-04",
  },
  {
    id: "3",
    slug: "personal-quinoa-power-bowl",
    title: "Personal Quinoa Power Bowl",
    image: "/Yay-Recipes-84-1.webp",
    category: "Healthy",
    datePublished: "2024-11-03",
  },
  {
    id: "4",
    slug: "quick-avocado-toast",
    title: "Quick Avocado Toast",
    image: "/Yay-Recipes-84-1.webp",
    category: "Breakfast",
    datePublished: "2024-11-02",
  },
  {
    id: "5",
    slug: "mini-berry-muffin",
    title: "Mini Berry Muffin",
    image: "/Yay-Recipes-84-1.webp",
    category: "Breakfast",
    datePublished: "2024-11-01",
  },
  {
    id: "6",
    slug: "personal-caesar-salad",
    title: "Personal Caesar Salad",
    image: "/Yay-Recipes-84-1.webp",
    category: "Salad",
    datePublished: "2024-10-31",
  },
  {
    id: "7",
    slug: "single-serve-smoothie-bowl",
    title: "Single-Serve Smoothie Bowl",
    image: "/Yay-Recipes-84-1.webp",
    category: "Breakfast",
    datePublished: "2024-10-30",
  },
  {
    id: "8",
    slug: "mini-chicken-wrap",
    title: "Mini Chicken Wrap",
    image: "/Yay-Recipes-84-1.webp",
    category: "Lunch",
    datePublished: "2024-10-29",
  },
];

async function getRecentRecipes(): Promise<Recipe[]> {
  try {
    console.log("🔥 Fetching recipes from recipes-data...");

    // Use centralized function instead of direct Firebase
    const recipeData: RecipeData[] = await getRecentRecipesData(8);

    const recipes = recipeData.map((recipe) => ({
      id: generateSlug(recipe.metadata.name),
      slug: generateSlug(recipe.metadata.name),
      title: recipe.metadata.name,
      image: recipe.metadata.images[0] || "/Yay-Recipes-84-1.webp",
      category: recipe.metadata.recipeCategory,
      datePublished: recipe.metadata.datePublished,
    }));

    console.log(
      "✅ Successfully fetched",
      recipes.length,
      "recipes from recipes-data"
    );
    console.log("📝 First recipe:", recipes[0]?.title);

    return recipes.slice(0, 8);
  } catch (error) {
    console.error("❌ Error fetching recipes from recipes-data:", error);
    console.log("🔄 Using fallback recipes");
    return fallbackRecipes;
  }
}

export async function RecentRecipes() {
  const recipes = await getRecentRecipes();
  const recentRecipesConfig = getRecentRecipesConfig();

  // Always render exactly 8 recipes
  const displayRecipes = recipes.slice(0, 8);

  return (
    <section id="recent-recipes" className="py-8 md:py-12 lg:py-16 bg-gray-50">
      <div className="container mx-auto px-2 md:px-3 max-w-6xl">
        {/* Section Heading with decorative lines */}
        <div className="text-center mb-8 md:mb-12 relative">
          <SectionHeader title={recentRecipesConfig.title} />
        </div>

        {/* Recipe Grid - 2x4 layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          {displayRecipes.map((recipe) => (
            <div key={recipe.id} className="group">
              <Link href={`/recipes/${recipe.slug}`} className="block">
                <div className="relative overflow-hidden rounded-xl mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <Image
                    src={recipe.image || "/Yay-Recipes-84-1.webp"}
                    alt={recipe.title}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    width={300}
                    height={300}
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    unoptimized={process.env.NODE_ENV === "development"}
                  />

                  {/* Category Badge - Overlay on image */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full text-gray-700 shadow-sm">
                      {recipe.category}
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
          ))}
        </div>
      </div>
    </section>
  );
}
