import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { RecipeArchiveWithParams } from "@/components/recipe-archive-with-params"

export const metadata: Metadata = {
  title: "All Mini Recipes - Mini Recipe | Small Portion Recipes",
  description:
    "Browse our complete collection of small-batch recipes designed for 1-2 servings. Find perfectly portioned recipes that eliminate food waste and fit your busy lifestyle.",
  keywords: ["mini recipes", "small batch", "small portions", "1-2 servings", "zero waste cooking", "quick recipes", "busy women recipes"],
  openGraph: {
    title: "All Mini Recipes - Small Portion Collection",
    description: "Browse our complete collection of small-batch recipes designed for 1-2 servings",
    type: "website",
  },
}

export default function RecipesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <RecipeArchiveWithParams />
      </main>
      <SiteFooter />
    </div>
  )
}
