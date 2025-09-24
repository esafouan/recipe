"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Sparkles, Gift, ArrowRight } from "lucide-react"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrate with your email service
    setIsSubmitted(true)
    setEmail("")
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-card/50 via-background to-card/30">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 shadow-2xl bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/20 px-4 py-2 rounded-full"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Free Weekly Recipe Collection
                  </Badge>
                  
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-balance">
                    Join 50,000+ Smart Women
                    <span className="block text-primary">Cooking Sustainably</span>
                  </h2>
                  
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Get exclusive mini recipes, meal planning tips, and eco-friendly cooking hacks 
                    delivered to your inbox every Tuesday. Plus, receive our FREE "7-Day Zero Waste Meal Plan" 
                    when you subscribe!
                  </p>
                </div>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 px-4 py-3 text-base rounded-full border-2 border-primary/20 focus:border-primary/40"
                      />
                      <Button 
                        type="submit" 
                        size="lg"
                        className="px-8 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold whitespace-nowrap"
                      >
                        Get Free Recipes
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      No spam, unsubscribe anytime. We respect your privacy.
                    </p>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-600">Welcome to the Mini Recipe Family!</h3>
                    <p className="text-muted-foreground">
                      Check your email for your FREE "7-Day Zero Waste Meal Plan" and weekly recipe updates.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    Weekly recipes
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Exclusive tips
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Gift className="w-4 h-4 text-primary" />
                    Free meal plans
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
