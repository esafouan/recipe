import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Award, Heart, CheckCircle, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah M.",
    location: "Texas",
    rating: 5,
    text: "Finally, recipes that don't leave me with tons of leftovers! As a busy working mom, Mini Recipe has been a game-changer for my weekly meal planning.",
    recipe: "Single-Serve Pasta"
  },
  {
    name: "Jennifer K.",
    location: "California", 
    rating: 5,
    text: "I've saved so much money on groceries since following Mini Recipe. No more throwing away expired food - everything gets used!",
    recipe: "Mini Quinoa Bowl"
  },
  {
    name: "Lisa R.",
    location: "New York",
    rating: 5,
    text: "Perfect portions for my empty nest lifestyle. The recipes are delicious and I love the focus on sustainability.",
    recipe: "Personal Pizza"
  }
]

const stats = [
  {
    icon: Users,
    number: "50,000+",
    label: "Active Community Members",
    description: "American women cooking smarter"
  },
  {
    icon: Award,
    number: "500+",
    label: "Tested Recipes",
    description: "All perfectly portioned"
  },
  {
    icon: Heart,
    number: "89%",
    label: "Food Waste Reduction",
    description: "Average savings reported"
  },
  {
    icon: CheckCircle,
    number: "4.9/5",
    label: "User Rating",
    description: "Based on 2,500+ reviews"
  }
]

export function SocialProofSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Trusted by Thousands
          </Badge>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">
            What Our Community Says
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of American women who've transformed their cooking with our mini recipes
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-2 p-0">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</div>
                <div className="font-semibold text-sm">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <Quote className="w-8 h-8 text-primary/20" />
                  
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      Tried: {testimonial.recipe}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Nutritionist Approved
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Eco-Certified Recipes
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Family Tested
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Zero Spam Promise
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
