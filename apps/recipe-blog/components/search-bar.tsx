"use client"

import { useState, useCallback, useEffect } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  className?: string
  placeholder?: string
  onSearch?: (query: string) => void
}

export function SearchBar({ 
  className = "", 
  placeholder = "Search recipes...",
  onSearch 
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
    
    // Reset loading state after navigation
    setTimeout(() => setIsSearching(false), 500)
  }, [onSearch, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleClear = () => {
    setQuery("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-orange-500" />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-24 h-11 border-gray-200 rounded-xl transition-all duration-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 hover:border-gray-300"
          aria-label="Search recipes"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-[88px] top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={!query.trim() || isSearching}
          className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-8 px-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="text-xs font-semibold">Search</span>
          )}
        </Button>
      </div>
    </form>
  )
}
