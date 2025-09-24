import { CategoryGrid } from "@/components/category-grid"
import { Badge } from "@/components/ui/badge"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
      <div className="container px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="text-sm font-medium px-4 py-2">
            Recipe Categories
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-sans font-bold text-balance">Explore Recipe Categories</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Browse our carefully curated recipe categories to find exactly what you're craving.
          </p>
        </div>

        <CategoryGrid />
      </div>
    </div>
  )
}
