import Link from "next/link";
import Image from "next/image";
import {
  UtensilsCrossed,
  Coffee,
  Soup,
  ChefHat,
  IceCream,
  ArrowRight,
  Salad,
  Cake,
  Candy,
  Leaf,
} from "lucide-react";
import { getCategoriesConfig } from "@/lib/config";
import { SectionHeader } from "./section-header";

const categoryIcons = [
  {
    id: "appetizer",
    title: "Appetizer",
    icon: UtensilsCrossed,
    href: "/recipes/appetizer",
  },
  {
    id: "soups-stews",
    title: "Soups & Stews",
    icon: Soup,
    href: "/recipes/soups-stews",
  },
  {
    id: "salads",
    title: "Salads",
    icon: Salad,
    href: "/recipes/salads",
  },
  {
    id: "main-dishes",
    title: "Main Dishes",
    icon: ChefHat,
    href: "/recipes/main-dishes",
  },
  {
    id: "breakfast",
    title: "Breakfast",
    icon: Coffee,
    href: "/recipes/breakfast",
  },
  {
    id: "breads",
    title: "Breads",
    icon: Cake,
    href: "/recipes/breads",
  },
  {
    id: "desserts",
    title: "Desserts",
    icon: IceCream,
    href: "/recipes/desserts",
  },
  {
    id: "easy-sweet-meals",
    title: "Easy Sweet Meals",
    icon: Candy,
    href: "/recipes/easy-sweet-meals",
  },
  {
    id: "vegetarian-vegan",
    title: "Vegetarian & Vegan",
    icon: Leaf,
    href: "/recipes/vegetarian-vegan",
  },
];

export function CategoriesSection() {
  const categoriesConfig = getCategoriesConfig()

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white">
      <div className="mx-auto px-2 sm:px-4 md:px-6 max-w-6xl">
        {/* Section Heading */}
        <div className="text-center mb-8 md:mb-12 relative">
          <SectionHeader title={categoriesConfig.title} />
        </div>
        {/* Meal Categories Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 sm:gap-2 md:gap-4 lg:gap-6 mb-12 md:mb-16">
          {categoriesConfig.main.slice(0, 8).map((category) => (
            <div key={category.id} className="flex flex-col w-full max-w-full">
              <figure className="mb-0 w-full">
                <Link href={`/recipes/${category.id}`} className="block w-full">
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={200}
                    height={150}
                    className="w-full h-auto aspect-[4/3] object-cover hover:opacity-90 transition-opacity duration-300 rounded-t-lg"
                    loading="lazy"
                    unoptimized={process.env.NODE_ENV === 'development'}
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                </Link>
              </figure>
              <div className="text-center bg-primary p-1 sm:p-2 rounded-b-lg">
                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white leading-tight">
                  <Link
                    href={`/recipes/${category.id}`}
                    className="text-white transition-colors duration-200 hover:text-white/90"
                  >
                    {category.title}
                  </Link>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Find your perfect recipe section */}
        <div className="text-center space-y-6 md:space-y-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-foreground">
            Find your perfect recipe!
          </h2>

          {/* Category Icons */}
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 lg:gap-6">
            {categoryIcons.slice(0, 7).map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className="group flex flex-col items-center space-y-2 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-primary rounded-full flex items-center justify-center group-hover:bg-primary/90 transition-colors duration-200 feminine-shadow">
                    <IconComponent className="w-6 h-6 md:w-7 md:h-7 lg:w-9 lg:h-9 text-primary-foreground" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    {category.title}
                  </span>
                </Link>
              );
            })}

            {/* View all recipes button */}
            <Link
              href="/recipes"
              className="group flex flex-col items-center space-y-2 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 border-2 border-primary rounded-full flex items-center justify-center group-hover:bg-primary/5 transition-colors duration-200">
                <ArrowRight className="w-6 h-6 md:w-7 md:h-7 lg:w-9 lg:h-9 text-primary" />
              </div>
              <span className="text-xs md:text-sm font-medium text-primary group-hover:text-primary/80 transition-colors duration-200">
                View all recipes
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
