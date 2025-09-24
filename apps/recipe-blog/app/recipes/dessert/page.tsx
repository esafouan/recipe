import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { RecipeArchiveWrapper } from "@/components/recipe-archive-wrapper"
import { PageBreadcrumb } from "@/components/page-breadcrumb"

export const metadata: Metadata = {
  title: "Mini Dessert Recipes - Small Batch Sweet Treats | Mini Recipe",
  description:
    "Indulge in perfectly portioned dessert recipes for 1-2 servings. Small batch cookies, cakes, and treats that satisfy your sweet tooth without temptation or waste.",
  keywords: [
    "mini dessert recipes",
    "small batch desserts",
    "single serving desserts",
    "dessert for one",
    "small batch cookies",
    "mini cakes",
    "portion control desserts",
    "healthy dessert portions",
    "no waste desserts",
    "mini sweet treats"
  ],
  openGraph: {
    title: "Mini Dessert Recipes - Small Batch Sweet Treats",
    description: "Indulge in perfectly portioned dessert recipes for 1-2 servings. Small batch treats with zero waste.",
    type: "website",
    images: [
      {
        url: "/dessert-cake-sweet-treats.jpg",
        width: 1200,
        height: 630,
        alt: "Mini dessert recipes - Small batch sweet treats",
      },
    ],
  },
}

export default function DessertRecipesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <PageBreadcrumb />
      <main className="flex-1">
        {/* SEO Content Section */}
        
        <RecipeArchiveWrapper defaultCategory="Dessert" />
      </main>
      <SiteFooter />
    </div>
  )
}
