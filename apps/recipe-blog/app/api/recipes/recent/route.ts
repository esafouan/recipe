// Simple API route to get recent recipes
import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

export async function GET() {
  try {
    // Simple Firestore query without auth
    const recipesRef = collection(db, 'recipes')
    const q = query(recipesRef, orderBy('datePublished', 'desc'), limit(8))
    const querySnapshot = await getDocs(q)
    
    const recipes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Error fetching recipes:', error)
    
    // Return fallback data on error
    const fallbackRecipes = [
      {
        id: "1",
        slug: "single-serve-creamy-pasta",
        title: "Single-Serve Creamy Pasta",
        image: "/Yay-Recipes-84-1.webp",
        category: "Dinner",
        datePublished: "2024-11-05"
      },
      {
        id: "2", 
        slug: "mini-chocolate-chip-cookies",
        title: "Mini Chocolate Chip Cookies",
        image: "/Yay-Recipes-84-1.webp",
        category: "Dessert",
        datePublished: "2024-11-04"
      },
      {
        id: "3",
        slug: "personal-quinoa-power-bowl", 
        title: "Personal Quinoa Power Bowl",
        image: "/Yay-Recipes-84-1.webp",
        category: "Healthy",
        datePublished: "2024-11-03"
      },
      {
        id: "4",
        slug: "quick-avocado-toast",
        title: "Quick Avocado Toast", 
        image: "/Yay-Recipes-84-1.webp",
        category: "Breakfast",
        datePublished: "2024-11-02"
      },
      {
        id: "5",
        slug: "mini-berry-muffin",
        title: "Mini Berry Muffin",
        image: "/Yay-Recipes-84-1.webp",
        category: "Breakfast",
        datePublished: "2024-11-01"
      },
      {
        id: "6",
        slug: "personal-caesar-salad",
        title: "Personal Caesar Salad",
        image: "/Yay-Recipes-84-1.webp",
        category: "Salad",
        datePublished: "2024-10-31"
      },
      {
        id: "7",
        slug: "single-serve-smoothie-bowl", 
        title: "Single-Serve Smoothie Bowl",
        image: "/Yay-Recipes-84-1.webp",
        category: "Breakfast",
        datePublished: "2024-10-30"
      },
      {
        id: "8",
        slug: "mini-chicken-wrap",
        title: "Mini Chicken Wrap",
        image: "/Yay-Recipes-84-1.webp",
        category: "Lunch",
        datePublished: "2024-10-29"
      }
    ]
    
    return NextResponse.json(fallbackRecipes)
  }
}
