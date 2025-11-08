"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSiteConfig, getNavigationConfig } from "@/lib/config"
import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  
  const siteConfig = getSiteConfig()
  const navigationConfig = getNavigationConfig()

  // Check if current path matches navigation item
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 shadow-sm will-change-transform">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-orange-400 to-pink-400"></div>
      
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6 max-w-7xl">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center transition-transform duration-200 group-hover:scale-105 will-change-transform">
              {mounted ? (
                <>
                  <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-xl opacity-0 group-hover:opacity-15 transition-opacity duration-200 blur-sm pointer-events-none"></div>
                  <Image
                    src={siteConfig.logo}
                    alt={siteConfig.logoAlt}
                    width={90}
                    height={60}
                    priority
                    unoptimized
                    sizes="90px"
                    className="relative z-10 transition-all duration-200 group-hover:drop-shadow-md"
                  />
                </>
              ) : (
                <div className="w-[90px] h-[70px] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-lg shadow-sm" />
              )}
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
                  "relative px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 group",
                  "hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50",
                  "hover:text-orange-600 hover:scale-[1.02] hover:shadow-sm",
                  "focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:bg-orange-50",
                  "will-change-transform",
                  isActive(item.href) 
                    ? "text-orange-600 bg-gradient-to-r from-orange-50 to-pink-50 shadow-sm border border-orange-200/50" 
                    : "text-slate-700 hover:text-orange-600"
                )}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <span className="relative z-10">{item.label}</span>
                {/* Active indicator */}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full" />
                )}
                {/* Simplified hover effect */}
                <span className="absolute inset-0 rounded-xl bg-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {/* Search Button - Desktop & Mobile */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-xl transition-all duration-200 group relative",
                "hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50",
                "hover:text-orange-600 hover:scale-105 hover:shadow-sm",
                "focus:ring-2 focus:ring-orange-400/20 focus:bg-orange-50",
                "will-change-transform",
                isMobileSearchOpen && "bg-gradient-to-r from-orange-50 to-pink-50 text-orange-600 shadow-sm"
              )}
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search className="h-5 w-5 relative z-10 transition-transform duration-200 group-hover:rotate-6" />
            </Button>
          )}

          {/* Mobile Menu Button */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "lg:hidden h-10 w-10 rounded-xl transition-all duration-200 group relative",
                "hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50",
                "hover:text-orange-600 hover:scale-105 hover:shadow-sm",
                "focus:ring-2 focus:ring-orange-400/20 focus:bg-orange-50",
                "will-change-transform",
                isMobileMenuOpen && "bg-gradient-to-r from-orange-50 to-pink-50 text-orange-600 shadow-sm"
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="relative z-10">
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 transition-transform duration-200 rotate-90" />
                ) : (
                  <Menu className="h-5 w-5 transition-transform duration-200 group-hover:rotate-6" />
                )}
              </div>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {mounted && isMobileMenuOpen && (
        <nav className="lg:hidden border-t border-orange-200/30 bg-white/95 backdrop-blur-md shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-6 space-y-2">
            {navigationConfig.main.map((item, index) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={cn(
                  "relative px-4 py-4 text-base font-semibold rounded-xl transition-all duration-200 group",
                  "hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50",
                  "hover:text-orange-600 hover:scale-[1.01] hover:shadow-sm",
                  "focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:bg-orange-50",
                  "will-change-transform",
                  isActive(item.href) 
                    ? "text-orange-600 bg-gradient-to-r from-orange-50 to-pink-50 shadow-sm border border-orange-200/50" 
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
                    <span className="w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full" />
                  )}
                </span>
                {/* Active indicator for mobile */}
                {isActive(item.href) && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-orange-400 to-pink-400 rounded-full" />
                )}
                {/* Simplified hover effect */}
                <span className="absolute inset-0 rounded-xl bg-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Mobile Search Bar */}
      {mounted && isMobileSearchOpen && (
        <div className="lg:hidden border-t border-orange-200/30 bg-white/95 backdrop-blur-md shadow-lg p-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-400 group-focus-within:text-orange-500 transition-colors duration-200" />
              <input
                type="search"
                placeholder="Search delicious recipes..."
                className={cn(
                  "w-full pl-12 pr-4 py-3.5 text-base bg-white/80 backdrop-blur-sm",
                  "border-2 border-orange-200/50 rounded-xl transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400",
                  "focus:bg-white focus:shadow-sm placeholder:text-slate-400"
                )}
                autoFocus
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "px-6 py-2.5 rounded-xl border-2 border-orange-200 text-orange-600 font-semibold",
                "hover:bg-orange-50 hover:border-orange-300 hover:shadow-sm",
                "focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
              )}
              onClick={() => setIsMobileSearchOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}