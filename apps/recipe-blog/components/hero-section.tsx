
export function HeroSection() {
  return (
    <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-2 md:px-3 max-w-6xl">
        <div className="text-center space-y-6 md:space-y-8">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
            FAMILY-FRIENDLY RECIPES<br />
            <span className="text-primary">YOU CAN MAKE AT HOME</span>
          </h1>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Welcome to Mini Recipe 👩‍🍳! <strong>Simple cooking that brings joy to your table.</strong> Find 
              recipes that won't stress you out - basic ingredients, budget-friendly meals, and dishes your 
              family will love. From creamy milkshakes to tasty fries, whether you're using kitchen gadgets 
              or just your hands, we're here to make cooking feel like second nature.
            </p>
            
            {/* Call to action */}
            <div className="pt-4">
              <a 
                href="#recent-recipes" 
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Explore Latest Recipes
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
