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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoriesConfig.main.map((category) => (
                <a
                  key={category.id}
                  href={`/recipes/${category.id}`}
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white"
                >
                  {/* Image Container */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center bg-no-repeat transform group-hover:scale-105 transition-transform duration-300"
                      style={{
                        backgroundImage: `url(${category.image})`,
                      }}
                    >
                      {/* Dark overlay for better text readability */}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>
                    </div>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                      <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-wide shadow-lg">
                        {category.title}
                      </h3>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent"></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
