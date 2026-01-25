import { NextResponse } from 'next/server'
import { searchRecipes } from '@/lib/api'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '12', 10)

  if (!query) {
    return NextResponse.json({ recipes: [], total: 0, page: 1, totalPages: 0 })
  }

  try {
    // Fetch slightly more to determine if there are more pages
    const fetchLimit = limit + 1
    const offset = (page - 1) * limit
    
    const allResults = await searchRecipes(query, 100) // Get all matching results for total count
    const total = allResults.length
    const totalPages = Math.ceil(total / limit)
    
    // Slice for current page
    const recipes = allResults.slice(offset, offset + limit)
    
    return NextResponse.json({ 
      recipes, 
      total,
      page,
      totalPages,
      hasMore: page < totalPages
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Failed to search recipes' },
      { status: 500 }
    )
  }
}
