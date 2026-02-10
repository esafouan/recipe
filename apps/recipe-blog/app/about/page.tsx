import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChefProfileCard } from "@/components/chef-profile-card";
import { HeroSection } from "@/components/hero-section-with-breadcrumb";
import { getAboutPageData, getChefData } from "@/lib/site-config";
import { SectionHeader } from "@/components/section-header";
import { Heart, Home, Users, Clock } from "lucide-react";

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

        {/* About Us Section */}
        <section id="story" className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-12 md:mb-16">
              <SectionHeader title="Our Story" />
              <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
                From one mom's kitchen experiment to a team of passionate food lovers - 
                this is how Cozy Bites Kitchen came to life
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left Content - Story */}
              <div className="lg:col-span-2 space-y-8">
                {/* Opening Hook */}
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <p className="text-xl font-medium text-gray-800 italic">
                      "It all started with a burnt lasagna and a crying toddler at 9 PM on a Tuesday..."
                    </p>
                  </CardContent>
                </Card>

                {/* Large featured image */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg w-full max-w-2xl mx-auto">
                  <Image
                    src={chefData.featuredImage || "/kitchen.jpg"}
                    alt="Sarah Mitchell cooking in her kitchen"
                    width={1940}
                    height={1636}
                    className="w-full h-auto object-cover max-h-[500px]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-base font-semibold drop-shadow-lg">Sarah's kitchen where all the recipe testing happens</p>
                  </div>
                </div>

                {/* The Beginning */}
                <div className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                    How It All Began
                  </h2>
                  
                  <div className="prose prose-lg max-w-none space-y-4">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      I&apos;ll never forget that Tuesday evening. Sarah, our founder, was juggling a full-time job, 
                      an energetic 3-year-old, and what was supposed to be a &quot;simple&quot; lasagna recipe. 
                      Spoiler alert: nothing about parenting and cooking is simple!
                    </p>
                    
                    <p className="text-lg text-gray-700 leading-relaxed">
                      As smoke filled her tiny apartment kitchen and her daughter wailed for dinner, she had an epiphany. 
                      Every recipe online seemed designed for families of six, professional chefs, or people with 
                      unlimited time. <strong>Where were the recipes for the rest of us?</strong>
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed">
                      That night, covered in tomato sauce and humbled by kitchen chaos, Sarah made a promise: 
                      she would create a space for <em>real</em> home cooks—the exhausted parents, the busy professionals, 
                      the cooking beginners who just want something delicious without the drama.
                    </p>
                  </div>
                </div>

                {/* The Journey */}
                <div className="bg-gray-50 p-8 rounded-2xl space-y-6">
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                    The Cozy Bites Philosophy
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Real Ingredients, Real Life</h3>
                        <p className="text-gray-600">
                          No exotic ingredients you'll never use again. No equipment that costs more than your rent. 
                          Just honest, accessible recipes using what's already in your pantry.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Comfort Over Perfection</h3>
                        <p className="text-gray-600">
                          Your food doesn't need to look Instagram-perfect. It needs to taste amazing and make you feel good. 
                          That's what matters here.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Family-Friendly Always</h3>
                        <p className="text-gray-600">
                          Every recipe is tested with picky eaters in mind. If my daughter approves, yours probably will too! 
                          Plus, I include tips for sneaking in those veggies.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Today */}
                <div className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                    Today: A Team of Passionate Cooks
                  </h2>
                  
                  <div className="prose prose-lg max-w-none space-y-4">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      What started as Sarah's personal survival guide has grown into something much bigger. 
                      Today, Cozy Bites Kitchen is powered by a <strong>diverse team of five passionate recipe creators</strong>, 
                      each bringing their unique expertise, cultural background, and cooking style.
                    </p>
                    
                    <p className="text-lg text-gray-700 leading-relaxed">
                      From Emily's lightning-fast 20-minute meals to Marco's authentic international flavors, 
                      from Olivia's vibrant healthy bowls to David's soul-warming comfort food classics—our team 
                      ensures you'll find recipes for every occasion, dietary preference, and skill level.
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed">
                      We&apos;re not celebrity chefs or culinary school graduates. We&apos;re home cooks, parents, 
                      busy professionals, and food lovers who test every single recipe in real kitchens with real families. 
                      Because at the end of the day, we're all just trying to feed ourselves and our loved ones well.
                    </p>

                    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-lg font-semibold text-gray-900 mb-3">
                        Meet Our Recipe Creators:
                      </p>
                      <ul className="space-y-2 text-gray-700">
                        <li><strong>Sarah Mitchell</strong> - Founder & Family Recipe Expert</li>
                        <li><strong>Emily Chen</strong> - Quick Meal Specialist</li>
                        <li><strong>Marco Rodriguez</strong> - International Flavor Expert</li>
                        <li><strong>Olivia Greene</strong> - Healthy Living Advocate</li>
                        <li><strong>David Thompson</strong> - Comfort Food Master</li>
                      </ul>
                      <Link 
                        href="/authors" 
                        className="inline-block mt-4 text-primary hover:text-primary/80 font-semibold"
                      >
                        Learn more about our team →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <Card className="bg-gray-900 text-white">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-serif font-bold mb-3">Let's Cook Together</h3>
                    <p className="text-lg mb-6 text-gray-300">
                      Join our community of home cooks and explore recipes from our diverse team. 
                      Every recipe comes with personal tips, substitution ideas, and honest reviews from real people.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link 
                        href="/recipes" 
                        className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors"
                      >
                        Browse All Recipes →
                      </Link>
                      <Link 
                        href="/authors" 
                        className="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        Meet Our Authors →
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Note */}
                <div className="bg-gray-100 border-l-4 border-gray-400 p-6 rounded-r-lg">
                  <p className="text-gray-700">
                    <strong>P.S.</strong> Got a recipe request or a cooking question? Our team would love to hear from you! 
                    Drop us a line at{" "}
                    <a href="mailto:hello@cozybiteskitchen.com" className="text-primary hover:underline font-medium">
                      hello@cozybiteskitchen.com
                    </a>
                    {" "}— we read every single message.
                  </p>
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
