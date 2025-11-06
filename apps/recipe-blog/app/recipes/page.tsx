import type { Metadata } from "next"

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
    <main>
      <p>Recipes page content coming soon...</p>
    </main>
  )
}
