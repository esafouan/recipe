"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getSearchConfig } from "@/lib/config"

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export function SearchBar({ placeholder, className = "" }: SearchBarProps) {
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const searchConfig = getSearchConfig()
  const defaultPlaceholder = placeholder || searchConfig.placeholder

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const clearSearch = () => {
    setQuery("")
  }

  if (!mounted) {
    return (
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={defaultPlaceholder}
          disabled
          className="pl-10 pr-10"
        />
      </div>
    )
  }

  return (
    mounted &&
      <form onSubmit={handleSearch} className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={defaultPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>
  )
}