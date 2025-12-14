import { Suspense } from "react"
import { SearchResults } from "@/components/search-results"
import { BasicHero } from "@/components/basic-hero"
import { Loader2 } from "lucide-react"

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ""
  
  return {
    title: query 
      ? `Search Results for "${query}" - Mini Recipe`
      : "Search Recipes - Mini Recipe",
    description: query
      ? `Find recipes matching "${query}". Browse our collection of mini recipes perfect for 1-2 servings.`
      : "Search our collection of perfectly portioned recipes. Find exactly what you're looking for with zero waste.",
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ""

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Search", href: "/search" },
    ...(query ? [{ label: `"${query}"` }] : [])
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section with Breadcrumbs */}
        <BasicHero
          title={query ? `Search Results for "${query}"` : "Search Recipes"}
          description={query ? `Found recipes matching your search` : "Search our collection of mini recipes"}
          breadcrumbs={breadcrumbs}
          size="medium"
        />

        {/* Search Results Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <Suspense 
              fallback={
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-gray-600">Searching recipes...</span>
                </div>
              }
            >
              <SearchResults query={query} />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  )
}
