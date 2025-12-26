"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSiteConfig, getNavigationConfig } from "@/lib/config"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { SearchBar } from "@/components/search-bar"

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const pathname = usePathname()
  
  const siteConfig = getSiteConfig()
  const navigationConfig = getNavigationConfig()

  // Check if current path matches navigation item
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-white/90 backdrop-blur-md shadow-sm will-change-transform">
      {/* Top accent bar */}
      <div className="h-1  from-orange-400 to-pink-400"></div>
      
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6 max-w-7xl">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center space-x-3 ">
            <div className="relative flex items-center ">
              <div className="absolute -inset-2  from-orange-400 to-pink-400 rounded-xl opacity-0 group-hover:opacity-15 transition-opacity duration-200 blur-sm pointer-events-none"></div>
              <img
                src={siteConfig.logo}
                alt={siteConfig.logoAlt}
                width={70}
                height={50}
                className="relative z-10 transition-all duration-200 group-hover:drop-shadow-md"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                {siteConfig.name}
              </span>
              <span className="text-xs text-muted-foreground font-medium tracking-wide">
                Delicious Recipes
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 ml-8">
            {navigationConfig.main.map((item, index) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={cn(
                  "relative px-4 py-2.5 text-sm font-semibold rounded-xl",
                  " hover:from-orange-50 hover:to-pink-50",
                  "hover:text-orange-600 hover:scale-[1.02] hover:shadow-sm",
                  "focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:bg-orange-50",
                  "will-change-transform",
                  isActive(item.href) 
                    ? "text-orange-600  from-orange-50 to-pink-50 shadow-sm border border-orange-200/50" 
                    : "text-slate-700 hover:text-orange-600"
                )}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <span className="relative z-10">{item.label}</span>
                {/* Active indicator */}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 from-orange-400 to-pink-400 rounded-full" />
                )}
                {/* Simplified hover effect */}
                <span className="absolute inset-0 rounded-xl bg-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Search Bar - Visible on md and up */}
          <div className="hidden md:block w-48 lg:w-64 xl:w-80">
            <SearchBar 
              placeholder="Search recipes..."
              className="w-full"
            />
          </div>

          {/* Search Button - Mobile only (hidden on md+) */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "md:hidden h-10 w-10 rounded-xl transition-all duration-200 group relative",
              " hover:from-orange-50 hover:to-pink-50",
              "hover:text-orange-600 hover:scale-105 hover:shadow-sm",
              "focus:ring-2 focus:ring-orange-400/20 focus:bg-orange-50",
              "will-change-transform",
              isMobileSearchOpen && " from-orange-50 to-pink-50 text-orange-600 shadow-sm"
            )}
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            aria-label="Toggle search"
          >
            <Search className="h-5 w-5 relative z-10 transition-transform duration-200 group-hover:rotate-6" />
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden h-10 w-10 rounded-xl transition-all duration-200 group relative",
              " hover:from-orange-50 hover:to-pink-50",
              "hover:text-orange-600 hover:scale-105 hover:shadow-sm",
              "focus:ring-2 focus:ring-orange-400/20 focus:bg-orange-50",
              "will-change-transform",
              isMobileMenuOpen && " from-orange-50 to-pink-50 text-orange-600 shadow-sm"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative z-10">
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 transition-transform duration-200 rotate-90" />
              ) : (
                <Menu className="h-5 w-5 transition-transform duration-200 group-hover:rotate-6" />
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden border-t border-orange-200/30 bg-white/95 backdrop-blur-md shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-6 space-y-2">
            {navigationConfig.main.map((item, index) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={cn(
                  "relative px-4 py-4 text-base font-semibold rounded-xl transition-all duration-200 group",
                  " hover:from-orange-50 hover:to-pink-50",
                  "hover:text-orange-600 hover:scale-[1.01] hover:shadow-sm",
                  "focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:bg-orange-50",
                  "will-change-transform",
                  isActive(item.href) 
                    ? "text-orange-600 from-orange-50 to-pink-50 shadow-sm border border-orange-200/50" 
                    : "text-slate-700 hover:text-orange-600"
                )}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {item.label}
                  {isActive(item.href) && (
                    <span className="w-2 h-2  from-orange-400 to-pink-400 rounded-full" />
                  )}
                </span>
                {/* Active indicator for mobile */}
                {isActive(item.href) && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8  from-orange-400 to-pink-400 rounded-full" />
                )}
                {/* Simplified hover effect */}
                <span className="absolute inset-0 rounded-xl bg-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Mobile Search Bar - Only on small screens */}
      {isMobileSearchOpen && (
        <div className="md:hidden border-t border-orange-200/30 bg-white/95 backdrop-blur-md shadow-lg p-4 animate-in slide-in-from-top-2 duration-200">
          <SearchBar 
            placeholder="Search delicious recipes..."
            onSearch={() => setIsMobileSearchOpen(false)}
          />
        </div>
      )}
    </header>
  )
}