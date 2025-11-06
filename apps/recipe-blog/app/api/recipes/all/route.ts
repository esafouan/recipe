// Simple API route to get all recipes for category pages, etc.
import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'

export async function GET() {
  try {
    // Simple Firestore query without auth
    const recipesRef = collection(db, 'recipes')
    const q = query(recipesRef, orderBy('datePublished', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const recipes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Error fetching all recipes:', error)
    
    // Return empty array on error - let client handle fallbacks
    return NextResponse.json([])
  }
}
