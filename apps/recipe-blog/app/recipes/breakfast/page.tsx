import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { RecipeArchiveWrapper } from "@/components/recipe-archive-wrapper"
import { PageBreadcrumb } from "@/components/page-breadcrumb"

export const metadata: Metadata = {
  title: "Mini Breakfast Recipes - Small Batch Morning Meals | Mini Recipe",
  description:
    "Start your day with perfectly portioned breakfast recipes for 1-2 servings. Quick morning meals that eliminate waste and fuel your busy day. Mini pancakes, eggs, and more.",
  keywords: [
    "mini breakfast recipes",
    "small batch breakfast",
    "single serving breakfast",
    "breakfast for one",
    "quick breakfast recipes",
    "small portion breakfast",
    "mini pancakes",
    "breakfast for busy women",
    "efficient morning meals"
  ],
  openGraph: {
    title: "Mini Breakfast Recipes - Small Batch Morning Meals",
    description: "Start your day with perfectly portioned breakfast recipes for 1-2 servings. Quick morning meals with zero waste.",
    type: "website",
    images: [
      {
        url: "/breakfast-pancakes-coffee-morning.jpg",
        width: 1200,
        height: 630,
        alt: "Mini breakfast recipes - Small batch morning meals",
      },
    ],
  },
}

export default function BreakfastRecipesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <PageBreadcrumb />
      <main className="flex-1">

        
        <RecipeArchiveWrapper defaultCategory="Breakfast" />
      </main>
      <SiteFooter />
    </div>
  )
}
