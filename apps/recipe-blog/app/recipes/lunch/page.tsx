import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mini Lunch Recipes - Small Batch Midday Meals | Mini Recipe",
  description:
    "Discover perfectly portioned lunch recipes for 1-2 servings. Quick, satisfying midday meals that keep you energized without creating leftovers. Perfect for busy professionals.",
  keywords: [
    "mini lunch recipes",
    "small batch lunch",
    "single serving lunch",
    "lunch for one",
    "quick lunch recipes",
    "small portion lunch",
    "office lunch",
    "busy women lunch",
    "efficient lunch meals",
    "healthy lunch bowls"
  ],
  openGraph: {
    title: "Mini Lunch Recipes - Small Batch Midday Meals",
    description: "Discover perfectly portioned lunch recipes for 1-2 servings. Quick, satisfying meals with zero waste.",
    type: "website",
    images: [
      {
        url: "/lunch-salad-sandwich-healthy.jpg",
        width: 1200,
        height: 630,
        alt: "Mini lunch recipes - Small batch midday meals",
      },
    ],
  },
}

export default function LunchRecipesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
      </main>
    </div>
  )
}
