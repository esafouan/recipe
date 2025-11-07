import { AllRecipes } from "@/components/all-recipes"

interface CategoryPageProps {
  category: string
  title: string
  description: string
}

export function CategoryPage({ category, title, description }: CategoryPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="text-center space-y-6 md:space-y-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
                {title}
              </h1>
              
              <div className="max-w-3xl mx-auto">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  {description
                    .split('**')
                    .map((part, index) => 
                      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                    )
                  }
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Category Recipes Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <AllRecipes category={category} />
          </div>
        </section>
      </main>
    </div>
  )
}
