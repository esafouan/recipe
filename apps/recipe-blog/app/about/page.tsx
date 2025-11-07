import type { Metadata } from "next";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ChefProfileCard } from "@/components/chef-profile-card";
import { getAboutPageData, getChefData } from "@/lib/site-config";

const aboutData = getAboutPageData();
const chefData = getChefData();

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
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="text-center space-y-6 md:space-y-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
                {aboutData.hero.title}
                <br />
                <span className="text-primary">
                  {aboutData.hero.subtitle}
                </span>
              </h1>

              <div className="max-w-3xl mx-auto space-y-6">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  {aboutData.hero.description}
                </p>

                {/* Call to action */}
                <div className="pt-4">
                  <a
                    href={aboutData.hero.ctaTarget}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    {aboutData.hero.ctaText}
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
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

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
