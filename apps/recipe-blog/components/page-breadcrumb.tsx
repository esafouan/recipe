"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"

interface PageBreadcrumbProps {
  items?: { label: string; href?: string }[]
}

export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  const pathname = usePathname()

  // Generate breadcrumb items based on pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(pathname)

  return (
    <div className="container px-4 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-1.5">
                <Home className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

function generateBreadcrumbItems(pathname: string): { label: string; href?: string }[] {
  const segments = pathname.split("/").filter(Boolean)

  const pathMap: Record<string, string> = {
    about: "About Us",
    contact: "Contact",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    breakfast: "Breakfast",
    dinner: "Dinner",
    lunch: "Lunch",
    cakes: "Cakes",
    healthy: "Healthy",
    recipes: "All Recipes",
  }

  return segments.map((segment, index) => {
    const isLast = index === segments.length - 1
    const href = isLast ? undefined : `/${segments.slice(0, index + 1).join("/")}`

    return {
      label: pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href,
    }
  })
}

// Helper component for BreadcrumbItem
function BreadcrumbItem({ children }: { children: React.ReactNode }) {
  return <li className="inline-flex items-center">{children}</li>
}
