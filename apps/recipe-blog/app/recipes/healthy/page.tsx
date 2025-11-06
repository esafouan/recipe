import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Healthy Mini Recipes - Nutritious Small Batch Meals | Mini Recipe",
  description:
    "Discover healthy mini recipes designed for 1-2 servings. Nutritious, portion-controlled meals that support your wellness goals while eliminating food waste. Perfect for busy, health-conscious women.",
  keywords: [
    "healthy mini recipes",
    "nutritious small batch",
    "healthy recipes for one",
    "portion controlled meals",
    "wellness recipes",
    "healthy cooking for busy women",
    "nutritious single servings",
    "balanced mini meals",
    "healthy zero waste cooking",
    "clean eating recipes",
    "mindful portion recipes",
    "healthy meal prep",
    "low calorie mini recipes",
    "nutrient dense meals"
  ],
  openGraph: {
    title: "Healthy Mini Recipes - Nutritious Small Batch Meals",
    description: "Discover healthy mini recipes designed for 1-2 servings. Nutritious, portion-controlled meals that support wellness goals.",
    type: "website",
    images: [
      {
        url: "/mediterranean-quinoa-bowl-colorful-vegetables.jpg",
        width: 1200,
        height: 630,
        alt: "Healthy mini recipes - Nutritious small batch meals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healthy Mini Recipes - Nutritious Small Batch Collection",
    description: "Discover healthy mini recipes designed for 1-2 servings. Perfect portions for wellness goals.",
    images: ["/mediterranean-quinoa-bowl-colorful-vegetables.jpg"],
  },
  alternates: {
    canonical: "https://minirecipe.net/recipes/healthy",
  },
}

export default function HealthyRecipesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
      </main>
      <SiteFooter />
    </div>
  )
}
