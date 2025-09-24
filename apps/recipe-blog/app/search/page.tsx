import type { Metadata } from "next"
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SearchResults } from "@/components/search-results"
import { SearchBar } from "@/components/search-bar"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Search Recipes - Mini Recipe | Find Perfect Small Batch Recipes",
  description:
    "Search our collection of small-batch recipes designed for 1-2 servings. Find recipes by ingredients, cuisine type, or cooking method. Perfect portions, zero waste.",
  keywords: ["recipe search", "mini recipes", "small batch", "recipe finder", "cooking search", "ingredient search"],
  openGraph: {
    title: "Search Recipes - Mini Recipe",
    description: "Search our collection of small-batch recipes designed for 1-2 servings",
    type: "website",
  },
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 bg-gradient-to-b from-background to-muted/10">
        <div className="container px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 mb-12">
              <Badge variant="secondary" className="text-sm font-medium px-4 py-2">
                Recipe Search
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-balance">Find Your Perfect Mini Recipe</h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                Search through our collection of small-batch recipes by name, ingredient, or cuisine type. Perfect portions for 1-2 people.
              </p>
            </div>

            <div className="mb-12">
              <SearchBar className="max-w-2xl mx-auto" placeholder="Search for recipes, ingredients, or cuisine..." />
              
              {/* Quick Search Suggestions */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <a href="/search?q=pasta" className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
                    pasta
                  </a>
                  <a href="/search?q=healthy" className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
                    healthy
                  </a>
                  <a href="/search?q=quick" className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
                    quick
                  </a>
                  <a href="/search?q=breakfast" className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
                    breakfast
                  </a>
                  <a href="/search?q=vegetarian" className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors">
                    vegetarian
                  </a>
                </div>
              </div>
            </div>

            <Suspense fallback={<SearchResultsSkeleton />}>
              <SearchResults />
            </Suspense>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-muted rounded-lg h-80 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
