import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  DollarSign, 
  Leaf, 
  Heart, 
  Users, 
  ShoppingCart,
  Target,
  Sparkles 
} from "lucide-react"

const benefits = [
  {
    icon: Clock,
    title: "Save Time",
    description: "20 minutes or less",
    details: "Quick recipes perfect for busy weeknights. No more spending hours in the kitchen.",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: DollarSign,
    title: "Save Money", 
    description: "Reduce grocery costs by 40%",
    details: "Buy only what you need. No more throwing away expired ingredients.",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "89% less food waste",
    details: "Small portions mean zero leftovers. Help save the planet, one meal at a time.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
  {
    icon: Heart,
    title: "Health Focused",
    description: "Portion-controlled nutrition",
    details: "Perfect serving sizes help maintain healthy eating habits without overeating.",
    color: "text-pink-600",
    bgColor: "bg-pink-50"
  },
  {
    icon: Target,
    title: "Perfect Portions",
    description: "1-2 servings every time",
    details: "Designed for singles, couples, and small families. No more massive recipes.",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    icon: ShoppingCart,
    title: "Smart Shopping",
    description: "Minimal ingredient lists",
    details: "Shop efficiently with shorter grocery lists. Most recipes use 6 ingredients or less.",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
]

export function RecipeBenefitsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Why Choose Mini Recipe
          </Badge>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-balance">
            Designed for the Modern
            <span className="block text-primary">American Woman</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We understand your busy lifestyle. Our mini recipes are crafted specifically for women who want 
            delicious, healthy meals without the waste, expense, or time commitment of traditional cooking.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary/20 hover:border-l-primary">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl ${benefit.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">{benefit.title}</h3>
                    <p className="font-semibold text-primary text-sm">{benefit.description}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{benefit.details}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call-to-Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-primary/20">
            <CardContent className="p-8 md:p-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold">
                    Ready to Transform Your Kitchen?
                  </h3>
                  <p className="text-muted-foreground">
                    Join thousands of women who've already made the switch to smarter, more sustainable cooking.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">500+</div>
                    <div className="text-xs text-muted-foreground">Recipes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">20 min</div>
                    <div className="text-xs text-muted-foreground">Average time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">$40</div>
                    <div className="text-xs text-muted-foreground">Monthly savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">0%</div>
                    <div className="text-xs text-muted-foreground">Food waste</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
