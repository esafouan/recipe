import { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { Breadcrumb } from "@/components/breadcrumb"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface CTAButton {
  text: string
  href: string
  icon?: ReactNode
  variant?: "primary" | "secondary" | "outline"
}

interface HeroSectionProps {
  title: string | ReactNode
  description?: string | ReactNode
  subtitle?: string
  breadcrumbs: BreadcrumbItem[]
  backgroundClass?: string
  backgroundImage?: string
  children?: ReactNode
  cta?: CTAButton
  textAlign?: "left" | "center"
  size?: "small" | "medium" | "large"
}

export function HeroSection({ 
  title, 
  description, 
  subtitle, 
  breadcrumbs, 
  backgroundClass = "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50",
  backgroundImage,
  children,
  cta,
  textAlign = "center",
  size = "large"
}: HeroSectionProps) {
  
  const sizeClasses = {
    small: "py-10 md:py-12 lg:py-14",
    medium: "py-10 md:py-12 lg:py-14", 
    large: "py-10 md:py-12 lg:py-14"
  }

  const titleSizeClasses = {
    small: "text-2xl md:text-3xl lg:text-4xl",
    medium: "text-2xl md:text-3xl lg:text-4xl",
    large: "text-2xl md:text-3xl lg:text-4xl"
  }

  const getCTAVariantClasses = (variant: string = "primary") => {
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90", 
      outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
    }
    return variants[variant as keyof typeof variants] || variants.primary
  }

  const renderTitle = () => {
    if (typeof title === 'string' && subtitle) {
      return (
        <h1 className={`${titleSizeClasses[size]} font-serif font-bold text-gray-900 leading-tight max-w-4xl ${textAlign === 'center' ? 'mx-auto' : ''}`}>
          {title}
          <br />
          <span className="text-primary">
            {subtitle}
          </span>
        </h1>
      )
    }
    
    return (
      <h1 className={`${titleSizeClasses[size]} font-serif font-bold text-gray-900 leading-tight max-w-4xl ${textAlign === 'center' ? 'mx-auto' : ''}`}>
        {title}
      </h1>
    )
  }

  const renderDescription = () => {
    if (!description) return null
    
    return (
      <div className={`max-w-3xl ${textAlign === 'center' ? 'mx-auto' : ''}`}>
        {typeof description === 'string' ? (
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            {description.split('**').map((part, index) => 
              index % 2 === 1 ? <strong key={index}>{part}</strong> : part
            )}
          </p>
        ) : (
          description
        )}
      </div>
    )
  }

  const renderCTA = () => {
    if (!cta) return null
    
    const CTAContent = (
      <>
        {cta.text}
        {cta.icon || (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        )}
      </>
    )

    const baseClasses = "inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
    const variantClasses = getCTAVariantClasses(cta.variant)
    
    if (cta.href.startsWith('/')) {
      return (
        <Link
          href={cta.href}
          className={`${baseClasses} ${variantClasses}`}
        >
          {CTAContent}
        </Link>
      )
    }
    
    return (
      <a
        href={cta.href}
        className={`${baseClasses} ${variantClasses}`}
      >
        {CTAContent}
      </a>
    )
  }

  return (
    <section className={`relative ${sizeClasses[size]} ${backgroundImage ? '' : backgroundClass}`}>
      {/* Background Image */}
      {backgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={85}
            />
          </div>
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-linear-to-br from-white/90 via-orange-50/80 to-amber-50/90 z-0" />
        </>
      )}

      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        {/* Breadcrumb */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb items={breadcrumbs} />
        </div>

        {/* Hero Content */}
        <div className={`${textAlign === 'center' ? 'text-center' : 'text-left'} space-y-4 md:space-y-6`}>
          {renderTitle()}
          
          {renderDescription()}

          {cta && (
            <div className="pt-4">
              {renderCTA()}
            </div>
          )}

          {children}
        </div>
      </div>
    </section>
  )
}
