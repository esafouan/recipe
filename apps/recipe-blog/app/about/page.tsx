import type { Metadata } from "next";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ChefProfileCard } from "@/components/chef-profile-card";
import { HeroSection } from "@/components/hero-section-with-breadcrumb";
import { getAboutPageData, getChefData } from "@/lib/site-config";

const aboutData = getAboutPageData();
const chefData = getChefData();

// Generate breadcrumbs
const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "About" }
]

export const metadata: Metadata = {
  title: aboutData.title,
  description: aboutData.description,
  keywords: aboutData.keywords,
  openGraph: aboutData.openGraph,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section with Breadcrumbs */}
        <HeroSection
          title={aboutData.hero.title}
          subtitle={aboutData.hero.subtitle}
          description={aboutData.hero.description}
          breadcrumbs={breadcrumbs}
          size="medium"
          cta={{
            text: aboutData.hero.ctaText,
            href: aboutData.hero.ctaTarget,
            variant: "primary"
          }}
        />

        {/* About Me Section */}
        <section id="story" className="py-16 md:py-20 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left Content - Story */}
              <div className="lg:col-span-2 space-y-8">
                {/* Large featured image */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg mb-8 w-full max-w-2xl mx-auto">
                  <Image
                    src={chefData.featuredImage}
                    alt={`${chefData.name} cooking in her kitchen`}
                    width={800}
                    height={450}
                    className="aspect-video w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>

                {/* Story Content */}
                <div className="prose prose-lg max-w-none">
                  {chefData.story.map((paragraph, index) => (
                    <p key={index} className="text-lg text-gray-700 leading-relaxed mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Right Sidebar - Chef Profile Card */}
              <ChefProfileCard chefData={chefData} variant="about" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
