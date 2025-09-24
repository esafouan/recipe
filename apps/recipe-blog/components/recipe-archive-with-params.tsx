"use client"

import { useSearchParams } from "next/navigation"
import { RecipeArchiveWrapper } from "./recipe-archive-wrapper"

export function RecipeArchiveWithParams() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'all'
  
  return <RecipeArchiveWrapper defaultCategory={category} />
}
