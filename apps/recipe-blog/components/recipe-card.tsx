import Link from "next/link"
import Image from "next/image"
import { getCategoryLabel } from "@/lib/api"

type Recipe = {
  id: string
  slug: string
  title: string
  image: string
  featuredImage?: string
  category: string
  datePublished: string
}

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  // Get the display label for the category (maps WordPress slug to user-friendly label)
  const categoryLabel = getCategoryLabel(recipe.category)
  return (
    <div className="group">
      <Link href={`/recipes/${recipe.slug}`} className="block">
        <div className="relative overflow-hidden rounded-xl mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
          <Image
            src={recipe.featuredImage || recipe.image }
            alt={recipe.title}
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
            width={400}
            height={400}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y5ZmFmYiIvPjwvc3ZnPg=="
            unoptimized={process.env.NODE_ENV === 'development'}
          />
          
          {/* Category Badge - Overlay on image */}
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-sm font-medium px-4 py-2 rounded-full text-gray-700 shadow-sm">
              {categoryLabel}
            </span>
          </div>
        </div>

        {/* Recipe Info */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-lg md:text-xl text-center text-foreground group-hover:text-primary transition-colors duration-200 leading-tight line-clamp-2">
            {recipe.title}
          </h3>
          
          {/* Date */}
          <div className="text-center">
            <span className="text-sm text-muted-foreground font-medium">
              {recipe.datePublished 
                ? new Date(recipe.datePublished).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'Recent'
              }
            </span>
          </div>
          
          {/* View Recipe Link */}
          <div className="text-center pt-2">
            <span className="text-sm md:text-base text-primary font-medium group-hover:underline transition-all duration-200">
              View Recipe →
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
