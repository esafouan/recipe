import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Leaf, Heart, Users, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-12 md:py-16 lg:py-24 overflow-hidden bg-gradient-to-br from-background via-card/30 to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-3" />
      <div className="absolute top-8 md:top-16 right-8 md:right-16 w-32 h-32 md:w-64 md:h-64 bg-primary/8 rounded-full blur-3xl" />
      <div className="absolute bottom-8 md:bottom-16 left-8 md:left-16 w-40 h-40 md:w-80 md:h-80 bg-secondary/8 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] md:min-h-[700px]">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left flex flex-col justify-center">
            <div className="space-y-4 md:space-y-6">
              <div className="flex justify-center lg:justify-start">
                <Badge
                  variant="secondary"
                  className="text-xs md:text-sm font-semibold px-4 md:px-5 py-2 bg-primary/20 text-primary-foreground border-primary/30 rounded-full inline-flex items-center"
                  style={{ backgroundColor: "rgb(234, 88, 12)", color: "white" }}
                >
                  <Leaf className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  Zero Waste Cooking
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-6xl font-serif font-bold text-balance leading-tight">
                Mini Recipes for
                <span className="mini-recipe-gradient block">Busy Women,</span>
                <span className="text-secondary">Zero Food Waste</span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground text-pretty leading-relaxed max-w-lg mx-auto lg:mx-0">
                Join thousands of American women discovering the joy of 
                <span className="font-semibold text-foreground"> small-batch cooking</span>. Save time, money, and the planet 
                with perfectly portioned recipes that eliminate leftovers and food waste.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="text-sm md:text-base px-6 md:px-8 py-4 md:py-6 rounded-full feminine-shadow hover:shadow-2xl transition-all duration-300 bg-primary hover:bg-primary/90 min-w-[200px]"
              >
                <Link href="/recipes">
                  Start Cooking Smart
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-sm md:text-base px-6 md:px-8 py-4 md:py-6 rounded-full bg-transparent border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 min-w-[200px]"
              >
                <Link href="/about">Our Mission</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 md:pt-6 max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center gap-3 p-3 md:p-4 rounded-2xl bg-card/50 hover:bg-card/80 transition-colors recipe-card-hover">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-semibold block">Perfect Portions</span>
                  <span className="text-xs text-muted-foreground">1-2 servings</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 md:p-4 rounded-2xl bg-card/50 hover:bg-card/80 transition-colors recipe-card-hover">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Leaf className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-semibold block">Zero Waste</span>
                  <span className="text-xs text-muted-foreground">No leftovers</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 md:p-4 rounded-2xl bg-card/50 hover:bg-card/80 transition-colors recipe-card-hover">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-semibold block">Quick & Easy</span>
                  <span className="text-xs text-muted-foreground">20 min max</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative order-first lg:order-last flex justify-center lg:justify-end">
            <div className="relative max-w-md lg:max-w-lg w-full">
              <div className="aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-card feminine-shadow">
                <Image
                  src="/beautiful-food-photography-colorful-ingredients-co.jpg"
                  alt="Beautiful small-portion meal showcasing colorful ingredients and sustainable cooking"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>

            <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-card rounded-xl md:rounded-2xl p-4 md:p-6 feminine-shadow border border-border/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <p className="font-serif font-bold text-sm md:text-lg">50K+ Women</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Cooking Smarter</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-secondary rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm border border-secondary/20">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 md:h-5 md:w-5 text-white" />
                <span className="text-xs md:text-sm font-semibold text-white">Eco-Friendly</span>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
