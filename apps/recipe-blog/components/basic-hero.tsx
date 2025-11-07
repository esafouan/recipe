import { HeroSection } from "@/components/hero-section-with-breadcrumb"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BasicHeroProps {
  title: string
  description?: string
  breadcrumbs: BreadcrumbItem[]
  size?: "small" | "medium" | "large"
}

export function BasicHero({ 
  title, 
  description, 
  breadcrumbs, 
  size = "small" 
}: BasicHeroProps) {
  return (
    <HeroSection
      title={title}
      description={description}
      breadcrumbs={breadcrumbs}
      size={size}
    />
  )
}
