
import { getHeroConfig } from "@/lib/config"

export function HeroSection() {
  const heroConfig = getHeroConfig()

  return (
    <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {/* Add consistent top spacing to match breadcrumb margin */}
        <div className="pt-6 md:pt-8">
          <div className="text-center space-y-6 md:space-y-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
            {heroConfig.title}<br />
            <span className="text-primary">{heroConfig.subtitle}</span>
          </h1>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {heroConfig.description.split('**').map((part, index) => 
                index % 2 === 1 ? <strong key={index}>{part}</strong> : part
              )}
            </p>
            
            {/* Call to action */}
            <div className="pt-4">
              <a 
                href={heroConfig.ctaTarget} 
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                {heroConfig.ctaText}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
