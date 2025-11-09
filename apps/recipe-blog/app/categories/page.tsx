import type { Metadata } from "next";
import { getCategoriesPageConfig, getCategoriesConfig } from "@/lib/config";
import { HeroSection } from "@/components/hero-section-with-breadcrumb";
import { SectionHeader } from "@/components/section-header";

const categoriesPageConfig = getCategoriesPageConfig();
const categoriesConfig = getCategoriesConfig();

// Generate breadcrumbs
const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Categories" }];

export const metadata: Metadata = {
  title: categoriesPageConfig.metadata.title,
  description: categoriesPageConfig.metadata.description,
  keywords: categoriesPageConfig.metadata.keywords,
  openGraph: {
    title: categoriesPageConfig.metadata.openGraph.title,
    description: categoriesPageConfig.metadata.openGraph.description,
    type: categoriesPageConfig.metadata.openGraph.type as "website",
    images: [
      {
        url: categoriesPageConfig.metadata.openGraph.image,
        width: 1200,
        height: 630,
        alt: categoriesPageConfig.metadata.openGraph.title,
      },
    ],
  },
};

export default function CategoriesPage() {
  // Get all categories and their counts (you can enhance this with real data later)
  const totalCategories = categoriesConfig.main.length;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section with Breadcrumbs */}
        <HeroSection
          title={categoriesPageConfig.hero.title}
          subtitle={categoriesPageConfig.hero.subtitle}
          description={categoriesPageConfig.hero.description}
          breadcrumbs={breadcrumbs}
          size="medium"
          cta={{
            text: categoriesPageConfig.hero.ctaText,
            href: categoriesPageConfig.hero.ctaTarget,
            variant: "primary",
          }}
        />

        {/* Categories Grid Section */}
        <section
          id="categories-grid"
          className="py-16 md:py-20 lg:py-24 bg-gray-50"
        >
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            {/* Section Header */}
            <div className="text-center mb-8 md:mb-12 relative">
              <SectionHeader title={categoriesPageConfig.title} />
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {categoriesConfig.main.map((category, index) => (
                <a
                  key={category.id}
                  href={`/recipes/${category.id}`}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white w-full max-w-full transform hover:scale-[1.02] hover:-translate-y-1 will-change-transform"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Optimized Gradient Border - Only shown on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm pointer-events-none"></div>
                  
                  {/* Card Content */}
                  <div className="relative bg-white rounded-2xl overflow-hidden">
                    {/* Image Container */}
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <div
                        className="w-full h-full bg-cover bg-center bg-no-repeat transform group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
                        style={{
                          backgroundImage: `url(${category.image})`,
                        }}
                      >
                        {/* Simplified overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-orange-600/60 transition-all duration-300"></div>
                      </div>

                      {/* Simple corner accent - CSS only */}
                      <div className="absolute top-0 right-0 w-0 h-0 border-l-[15px] border-l-transparent border-t-[15px] border-t-orange-400/70 group-hover:border-t-pink-400/70 transition-colors duration-300"></div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center px-2 sm:px-4 transform group-hover:scale-105 transition-transform duration-300 will-change-transform">
                        
                        <h3 className="text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold uppercase tracking-wide leading-tight drop-shadow-lg transition-all duration-300">
                          {category.title}
                        </h3>
                        
                        {/* Subtitle - only on larger screens to reduce mobile load */}
                        <p className="hidden sm:block text-white/80 text-xs sm:text-sm mt-1 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300 delay-75">
                          Explore recipes
                        </p>
                      </div>
                    </div>

                    {/* Bottom accent bar - simplified */}
                    <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-orange-400 to-pink-400 transition-all duration-400 ease-out"></div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
