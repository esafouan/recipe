import type { Metadata } from "next"
import { CategoryPage } from "@/components/category-page"
import { getCategoryRecipesConfig } from "@/lib/config"

const categoryConfig = getCategoryRecipesConfig("breakfast")

export const metadata: Metadata = {
  title: categoryConfig.metadata.title,
  description: categoryConfig.metadata.description,
  keywords: categoryConfig.metadata.keywords,
  openGraph: {
    title: categoryConfig.metadata.openGraph.title,
    description: categoryConfig.metadata.openGraph.description,
    type: categoryConfig.metadata.openGraph.type as "website",
    images: [
      {
        url: categoryConfig.metadata.openGraph.image,
        width: 1200,
        height: 630,
        alt: categoryConfig.metadata.openGraph.title,
      },
    ],
  },
}

export default function BreakfastRecipesPage() {
  return (
    <CategoryPage category="breakfast" />
  )
}
