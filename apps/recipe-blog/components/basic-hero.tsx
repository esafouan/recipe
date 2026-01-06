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
  backgroundImage?: string
}

export function BasicHero({ 
  title, 
  description, 
  breadcrumbs, 
  size = "small",
  backgroundImage
}: BasicHeroProps) {
  return (
    <HeroSection
      title={title}
      description={description}
      breadcrumbs={breadcrumbs}
      size={size}
      backgroundImage={backgroundImage}
    />
  )
}
