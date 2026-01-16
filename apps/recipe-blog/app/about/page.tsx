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

        {/* About Me Section */}
        <section id="story" className="py-16 md:py-20 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-12 md:mb-16">
              <SectionHeader title="My Story" />
              <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
                From a cramped apartment kitchen to sharing recipes with thousands - 
                this is how Cozy Bites Kitchen came to life
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left Content - Story */}
              <div className="lg:col-span-2 space-y-8">
                {/* Opening Hook */}
                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <p className="text-xl font-medium text-gray-800 italic">
                      "It all started with a burnt lasagna and a crying toddler at 9 PM on a Tuesday..."
                    </p>
                  </CardContent>
                </Card>

                {/* Large featured image */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg w-full max-w-2xl mx-auto">
                  <Image
                    src="/kitchen.jpg"
                    alt={`${chefData.name} cooking in her kitchen`}
                    width={800}
                    height={450}
                    className="aspect-video w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-sm font-medium">My actual kitchen where the magic happens ✨</p>
                  </div>
                </div>

                {/* The Beginning */}
                <div className="space-y-6">
                  <h2 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                    <Heart className="text-orange-500" size={32} />
                    How It All Began
                  </h2>
                  
                  <div className="prose prose-lg max-w-none space-y-4">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      I'll never forget that Tuesday evening. I was juggling a full-time job, a energetic 3-year-old, 
                      and what was supposed to be a "simple" lasagna recipe. Spoiler alert: nothing about parenting and 
                      cooking is simple! 😅
                    </p>
                    
                    <p className="text-lg text-gray-700 leading-relaxed">
                      As smoke filled my tiny apartment kitchen and my daughter wailed for dinner, I had an epiphany. 
                      Every recipe online seemed designed for families of six, professional chefs, or people with 
                      unlimited time. <strong>Where were the recipes for the rest of us?</strong>
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed">
                      That night, covered in tomato sauce and humbled by kitchen chaos, I made a promise to myself: 
                      I would create a space for <em>real</em> home cooks—the exhausted moms, the busy professionals, 
                      the cooking beginners who just want something delicious without the drama.
                    </p>
                  </div>
                </div>

                {/* The Journey */}
                <div className="bg-orange-50 p-8 rounded-2xl space-y-6">
                  <h2 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                    <Home className="text-orange-500" size={32} />
                    The Cozy Bites Philosophy
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Real Ingredients, Real Life</h3>
                        <p className="text-gray-700">
                          No exotic ingredients you'll never use again. No equipment that costs more than your rent. 
                          Just honest, accessible recipes using what's already in your pantry.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Comfort Over Perfection</h3>
                        <p className="text-gray-700">
                          Your food doesn't need to look Instagram-perfect. It needs to taste amazing and make you feel good. 
                          That's what matters here.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Family-Friendly Always</h3>
                        <p className="text-gray-700">
                          Every recipe is tested with picky eaters in mind. If my daughter approves, yours probably will too! 
                          Plus, I include tips for sneaking in those veggies. 🥦
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Today */}
                <div className="space-y-6">
                  <h2 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                    <Users className="text-orange-500" size={32} />
                    Today & Beyond
                  </h2>
                  
                  <div className="prose prose-lg max-w-none space-y-4">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      What started as my personal survival guide has grown into a community of over <strong>50,000 home cooks</strong> 
                      who share one common goal: making delicious, comforting food without the stress.
                    </p>
                    
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Every week, I'm in my kitchen (still the same small one!) testing new recipes, reading your comments, 
                      and answering your questions. Because at the end of the day, we're all just trying to feed ourselves 
                      and our loved ones well.
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed">
                      My daughter is now 8, and guess what? She's my official taste-tester and harshest critic. 😊 
                      And that burnt lasagna from years ago? We've perfected it together—and I'll teach you how to make it too.
                    </p>
                  </div>
                </div>

                {/* Call to Action */}
                <Card className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                  <CardContent className="p-8 text-center">
                    <Clock className="mx-auto mb-4" size={48} />
                    <h3 className="text-2xl font-bold mb-3">Let's Cook Together</h3>
                    <p className="text-lg mb-6 opacity-90">
                      Join our community and never stress about "what's for dinner" again. 
                      Every recipe comes with my personal tips, substitution ideas, and honest reviews from real home cooks.
                    </p>
                    <Link 
                      href="/recipes" 
                      className="inline-block bg-white text-orange-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Browse All Recipes →
                    </Link>
                  </CardContent>
                </Card>

                {/* Personal Note */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                  <p className="text-gray-800 italic">
                    <strong>P.S.</strong> Got a recipe request or a cooking disaster story? I'd love to hear it! 
                    Drop me a line at{" "}
                    <a href="mailto:hello@cozybiteskitchen.com" className="text-orange-600 hover:underline font-medium">
                      hello@cozybiteskitchen.com
                    </a>
                    {" "}— I read every single message. 💌
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
