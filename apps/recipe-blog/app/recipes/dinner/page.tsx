import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Mini Dinner Recipes - Small Batch Evening Meals | Mini Recipe",
  description:
    "Discover perfectly portioned dinner recipes for 1-2 servings. Quick, delicious evening meals that eliminate leftovers and reduce food waste. Perfect for busy women cooking small batches.",
  keywords: [
    "mini dinner recipes",
    "small batch dinner",
    "single serving dinner",
    "dinner for one",
    "dinner for two",
    "quick dinner recipes",
    "small portion dinner",
    "zero waste dinner",
    "busy women dinner",
    "efficient dinner recipes"
  ],
  openGraph: {
    title: "Mini Dinner Recipes - Small Batch Evening Meals",
    description: "Discover perfectly portioned dinner recipes for 1-2 servings. Quick, delicious evening meals with zero leftovers.",
    type: "website",
    images: [
      {
        url: "/dinner-main-course-elegant.jpg",
        width: 1200,
        height: 630,
        alt: "Mini dinner recipes - Small batch evening meals",
      },
    ],
  },
}

export default function DinnerRecipesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
      </main>
      <SiteFooter />
    </div>
  )
}
