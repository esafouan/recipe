"use client"

import Link from "next/link"
import { Menu, Heart, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { useState } from "react"

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4 md:px-6 max-w-7xl">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="h-3 w-3 md:h-4 md:w-4 text-white" />
            </div>
            <span className="font-serif text-lg md:text-2xl font-bold mini-recipe-gradient">Mini Recipe</span>
            {/* <Image src=></Image> */}
          </Link>

          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 text-sm font-semibold">
            <Link href="/recipes" className="transition-colors hover:text-primary whitespace-nowrap">
              All Recipes
            </Link>
            <Link href="/recipes/breakfast" className="transition-colors hover:text-primary">
              Breakfast
            </Link>
            <Link href="/recipes/dinner" className="transition-colors hover:text-primary">
              Dinner
            </Link>
            <Link href="/recipes/dessert" className="transition-colors hover:text-primary">
              Dessert
            </Link>
            <Link href="/recipes/lunch" className="transition-colors hover:text-primary">
              Lunch
            </Link>
            <Link href="/recipes/healthy" className="transition-colors hover:text-primary">
              Healthy
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          >
            <Search className="h-4 w-4" />
          </Button>

          <div className="hidden lg:block">
            <SearchBar className="w-48 xl:w-64" />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isMobileSearchOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur p-3">
          <SearchBar className="w-full" />
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <nav className="flex flex-col space-y-1 p-3">
            <Link
              href="/recipes"
              className="px-3 py-3 text-sm font-semibold transition-colors hover:text-primary hover:bg-primary/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              All Recipes
            </Link>
            <Link
              href="/recipes/breakfast"
              className="px-3 py-3 text-sm font-semibold transition-colors hover:text-primary hover:bg-primary/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Breakfast
            </Link>
            <Link
              href="/recipes/dinner"
              className="px-3 py-3 text-sm font-semibold transition-colors hover:text-primary hover:bg-primary/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dinner
            </Link>
            <Link
              href="/recipes/dessert"
              className="px-3 py-3 text-sm font-semibold transition-colors hover:text-primary hover:bg-primary/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dessert
            </Link>
            <Link
              href="/recipes/lunch"
              className="px-3 py-3 text-sm font-semibold transition-colors hover:text-primary hover:bg-primary/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Lunch
            </Link>
            <Link
              href="/recipes/healthy"
              className="px-3 py-3 text-sm font-semibold transition-colors hover:text-primary hover:bg-primary/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Healthy
            </Link>
            <div className="pt-2 border-t border-border/40 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-full border-primary/30 hover:bg-primary/5 hover:border-primary/50 bg-transparent"
              >
                Join Newsletter
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
