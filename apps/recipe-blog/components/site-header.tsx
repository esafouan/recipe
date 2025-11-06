"use client"

import Link from "next/link"
import { Menu, Heart, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { useState } from "react"
import Image from "next/image"

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  //mahdi
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4 md:px-6 max-w-7xl">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center">
              <Image
                src="/logonobg.png"
                alt="Mini Recipe Logo"
                width={80}
                height={60}
               
              />
            </div>
          </Link>

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
    
        </div>
      )}
    </header>
  )
}
