import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const categories = [
  {
    name: "Breakfast",
    description: "Start your day with energy",
    image: "/breakfast-pancakes-coffee-morning.jpg",
    href: "/categories/breakfast",
    count: 45,
    color: "bg-gradient-to-br from-amber-100 to-orange-100",
    icon: "🌅",
  },
  {
    name: "Lunch",
    description: "Perfect midday meals",
    image: "/lunch-salad-sandwich-healthy.jpg",
    href: "/categories/lunch",
    count: 62,
    color: "bg-gradient-to-br from-green-100 to-emerald-100",
    icon: "🥗",
  },
  {
    name: "Dinner",
    description: "Satisfying evening dishes",
    image: "/dinner-main-course-elegant.jpg",
    href: "/categories/dinner",
    count: 89,
    color: "bg-gradient-to-br from-blue-100 to-indigo-100",
    icon: "🍽️",
  },
  {
    name: "Cakes",
    description: "Delicious baked treats",
    image: "/chocolate-chip-cookies-golden-brown.jpg",
    href: "/categories/cakes",
    count: 34,
    color: "bg-gradient-to-br from-pink-100 to-rose-100",
    icon: "🎂",
  },
  {
    name: "Healthy",
    description: "Nutritious & wholesome",
    image: "/mediterranean-quinoa-bowl-colorful-vegetables.jpg",
    href: "/categories/healthy",
    count: 56,
    color: "bg-gradient-to-br from-lime-100 to-green-100",
    icon: "🥬",
  },
]

export function CategoryGrid() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4">
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="text-sm font-medium px-4 py-2">
            Recipe Categories
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-sans font-bold text-balance bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Browse by Category
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
            Discover the perfect recipe for any occasion, from energizing breakfasts to indulgent desserts.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {categories.map((category, index) => (
            <Link key={category.name} href={category.href} className="group">
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border-0 shadow-lg">
                <div className={`${category.color} p-6 text-center space-y-4`}>
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-sans text-xl font-bold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium">{category.description}</p>
                  </div>
                </div>
                <div className="aspect-[4/3] overflow-hidden relative">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={300}
                    height={225}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-6 text-center bg-white">
                  <Badge variant="outline" className="text-xs font-semibold">
                    {category.count} recipes
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            View All Recipes
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
