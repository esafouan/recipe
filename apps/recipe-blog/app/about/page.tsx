import type { Metadata } from "next"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Heart, Users, Award, Utensils, Recycle } from "lucide-react"
import { PageBreadcrumb } from "@/components/page-breadcrumb"

export const metadata: Metadata = {
  title: "About Mini Recipe | Small Recipes for Busy American Women | Our Story",
  description:
    "Learn about Mini Recipe's mission to reduce food waste through perfectly portioned small recipes designed for busy American women. Discover our story, values, and commitment to sustainable cooking that saves time and money.",
  keywords: [
    "about mini recipe", 
    "small portions", 
    "food waste reduction", 
    "sustainable cooking", 
    "busy women recipes",
    "our story", 
    "mission", 
    "values",
    "american women cooking",
    "zero waste kitchen",
    "portion control",
    "eco-friendly recipes"
  ],
  openGraph: {
    title: "About Mini Recipe - Small Recipes for Busy American Women",
    description: "Learn about our mission to reduce food waste through perfectly portioned small recipes designed for modern women's lifestyles.",
    type: "article",
    images: [
      {
        url: "/beautiful-food-photography-colorful-ingredients-co.jpg",
        width: 1200,
        height: 630,
        alt: "Mini Recipe - Small batch cooking for busy women",
      },
    ],
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <PageBreadcrumb />
      <main className="flex-1">
        <div className="py-16">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            {/* Hero Section */}
            <div className="text-center space-y-6 mb-16">
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-balance">About Mini Recipe</h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
                We're passionate about creating perfectly portioned small recipes that help busy American women cook exactly what they
                need, reducing food waste while maximizing flavor. Every recipe is designed for 1-2 servings with zero
                leftovers.
              </p>
            </div>

            {/* Story Section */}
            <div className="mb-16">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="space-y-6 order-2 lg:order-1">
                  <div className="space-y-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">Our Journey</Badge>
                    <h2 className="text-3xl lg:text-4xl font-serif font-bold text-balance">Our Story</h2>
                  </div>
                  <div className="space-y-6 text-muted-foreground leading-relaxed">
                    <div className="bg-background/50 p-6 rounded-xl border border-border/50">
                      <p className="text-base lg:text-lg">
                        Mini Recipe was born from a simple observation: too much food goes to waste because recipes are
                        designed for large families, but many American women today cook for just themselves, their partner, or small households. 
                        In 2023, we set out to solve this problem with perfectly portioned recipes.
                      </p>
                    </div>
                    <p className="text-base">
                      Our founder, a busy working woman and sustainability advocate, was tired of throwing away half-used
                      ingredients and oversized portions. We understand the modern woman's lifestyle - juggling career, family, 
                      and personal goals while trying to eat well and live sustainably.
                    </p>
                    <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                      <p className="text-base font-medium text-foreground">
                        Every Mini Recipe is carefully crafted by women, for women, to use ingredients efficiently, minimize waste, and
                        deliver maximum satisfaction in smaller portions. We're not just changing how you cook – we're
                        empowering you to live more intentionally.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="relative">
                    <div className="aspect-[4/5] lg:aspect-square rounded-2xl overflow-hidden shadow-lg">
                      <Image
                        src="/beautiful-food-photography-colorful-ingredients-co.jpg"
                        alt="Beautiful small-portion meal showcasing colorful ingredients and sustainable cooking"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary/10 rounded-full blur-lg"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-serif font-bold text-center mb-12">Our Values</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto shadow-lg">
                      <Leaf className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold">Zero Waste</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Every recipe is designed to use ingredients completely, eliminating food waste and saving money for busy households.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mx-auto shadow-lg">
                      <Utensils className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold">Perfect Portions</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Small recipes designed for 1-2 people, ensuring you cook exactly what you need without leftovers.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto shadow-lg">
                      <Heart className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold">Mindful Cooking</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We promote intentional cooking that respects ingredients and fits into your busy lifestyle.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mx-auto shadow-lg">
                      <Users className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold">Community Focused</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We listen to American women's real cooking challenges, creating recipes that fit modern lifestyles.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto shadow-lg">
                      <Recycle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold">Sustainability</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Every recipe contributes to a more sustainable food system by reducing waste and supporting eco-conscious living.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mx-auto shadow-lg">
                      <Award className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold">Quality</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Small portions don't mean compromising on flavor – every recipe delivers maximum taste.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Team Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-serif font-bold text-center mb-12">Meet Our Team</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="text-center">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-gradient-to-br from-primary/20 to-secondary/20">
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="w-12 h-12 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-semibold">Emma Rodriguez</h3>
                      <p className="text-sm text-muted-foreground mb-2">Founder & Recipe Developer</p>
                      <div className="flex justify-center gap-2 mb-3 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          Sustainability Expert
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Zero Waste Advocate
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        A busy working mom who understands the challenge of cooking for small families while maintaining a sustainable lifestyle.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-gradient-to-br from-secondary/20 to-primary/20">
                      <div className="w-full h-full flex items-center justify-center">
                        <Utensils className="w-12 h-12 text-secondary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-semibold">Maria Chen</h3>
                      <p className="text-sm text-muted-foreground mb-2">Food Stylist & Photographer</p>
                      <div className="flex justify-center gap-2 mb-3 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          Visual Arts Expert
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Food Specialist
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Maria captures the beauty of our mini recipes through stunning photography that makes every small dish look irresistible.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-gradient-to-br from-primary/20 to-secondary/20">
                      <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="w-12 h-12 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-semibold">Dr. Sarah Kim</h3>
                      <p className="text-sm text-muted-foreground mb-2">Nutritionist & Wellness Expert</p>
                      <div className="flex justify-center gap-2 mb-3 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          Registered Dietitian
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Women's Health
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Dr. Kim ensures our recipes support busy women's nutritional needs while promoting sustainable eating habits.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Mission Statement */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8 lg:p-12 text-center space-y-6">
                <h2 className="text-2xl lg:text-3xl font-serif font-bold">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                  To revolutionize home cooking for busy American women by providing perfectly portioned small recipes that eliminate food
                  waste, save money, and promote sustainable living. We believe that cooking for one or two doesn't mean
                  compromising on flavor or variety – it means being more intentional with every ingredient and empowering women 
                  to live more sustainably without sacrificing quality or taste.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">500+</div>
                    <div className="text-xs text-muted-foreground">Mini Recipes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">50K+</div>
                    <div className="text-xs text-muted-foreground">Women Served</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">89%</div>
                    <div className="text-xs text-muted-foreground">Waste Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">$40</div>
                    <div className="text-xs text-muted-foreground">Monthly Savings</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
