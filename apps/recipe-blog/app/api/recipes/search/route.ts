// Simple API route to search recipes
import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { collection, query, getDocs } from 'firebase/firestore'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get('q') || ''
    
    if (!searchTerm) {
      return NextResponse.json([])
    }
    
    // Simple Firestore query - get all recipes and filter client-side
    const recipesRef = collection(db, 'recipes')
    const querySnapshot = await getDocs(recipesRef)
    
    const allRecipes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[]
    
    // Filter recipes by search term
    const searchTermLower = searchTerm.toLowerCase()
    const filteredRecipes = allRecipes.filter((recipe: any) => 
      recipe.title?.toLowerCase().includes(searchTermLower) ||
      recipe.description?.toLowerCase().includes(searchTermLower) ||
      recipe.category?.toLowerCase().includes(searchTermLower) ||
      (recipe.tags && recipe.tags.some((tag: string) => tag.toLowerCase().includes(searchTermLower)))
    )
    
    return NextResponse.json(filteredRecipes.slice(0, 20)) // Limit to 20 results
  } catch (error) {
    console.error('Error searching recipes:', error)
    return NextResponse.json([])
  }
}
