"use client"

import Link from "next/link"
import { Menu, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { getSiteConfig, getNavigationConfig } from "@/lib/config"
import { useState, useEffect } from "react"
import Image from "next/image"

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const siteConfig = getSiteConfig()
  const navigationConfig = getNavigationConfig()

  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4 md:px-6 max-w-7xl">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center">
              {mounted ? (
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.logoAlt}
                  width={80}
                  height={60}
                  priority
                  unoptimized
                  sizes="80px"
                />
              ) : (
                <div className="w-20 h-15 bg-gray-200 animate-pulse rounded" />
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationConfig.main.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          <div className="hidden lg:block">
            {mounted && <SearchBar className="w-48 xl:w-64" />}
          </div>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {mounted && isMobileSearchOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur p-3">
          <SearchBar className="w-full" />
        </div>
      )}

      {mounted && isMobileMenuOpen && (
        <nav className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur p-4">
          <div className="flex flex-col space-y-3">
            {navigationConfig.main.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}