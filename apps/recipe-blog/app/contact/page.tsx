import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactForm } from "@/components/contact-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageSquare, Clock, Leaf, Heart } from "lucide-react"
import { PageBreadcrumb } from "@/components/page-breadcrumb"

export const metadata: Metadata = {
  title: "Contact Us - Mini Recipe",
  description:
    "Get in touch with the Mini Recipe team. Share your small recipe ideas, ask questions about portion sizes, or tell us about your zero-waste cooking journey.",
  keywords: ["contact", "support", "questions", "feedback", "mini recipe", "small portions", "zero waste"],
  openGraph: {
    title: "Contact Us - Mini Recipe",
    description: "Get in touch with our team. We'd love to hear about your small recipe journey!",
    type: "website",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <PageBreadcrumb />
      <main className="flex-1">
        <div className="py-16">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            {/* Header */}
            <div className="text-center space-y-6 mb-16">
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-balance">Get in Touch</h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
                We'd love to hear from you! Whether you have questions about portion sizes, want to share your
                zero-waste cooking success, or have ideas for new mini recipes, don't hesitate to reach out.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg border-0 bg-background/50 backdrop-blur-sm h-fit">
                  <CardHeader className="pb-6">
                    <CardTitle className="font-serif text-xl lg:text-2xl">Send us a Message</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      We're here to help with your mini recipe journey. Let us know how we can assist you!
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ContactForm />
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <Card className="shadow-lg border-0 bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-4 lg:p-6 space-y-4">
                    <div className="text-center mb-4">
                      <h2 className="font-serif text-lg font-semibold mb-1">Ways to Connect</h2>
                      <p className="text-xs text-muted-foreground">Choose the best way to reach our team</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-serif font-semibold text-sm mb-1">Email Us</h3>
                          <p className="text-xs text-muted-foreground mb-1">For general inquiries and recipe questions</p>
                          <a
                            href="mailto:hello@minirecipe.com"
                            className="text-primary hover:underline text-xs font-medium transition-colors break-words"
                          >
                            hello@minirecipe.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="h-5 w-5 text-secondary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-serif font-semibold text-sm mb-1">Recipe Support</h3>
                          <p className="text-xs text-muted-foreground mb-1">
                            Need help with portion adjustments or ingredient substitutions?
                          </p>
                          <a
                            href="mailto:support@minirecipe.com"
                            className="text-secondary hover:underline text-xs font-medium transition-colors break-words"
                          >
                            support@minirecipe.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-serif font-semibold text-sm mb-1">Response Time</h3>
                          <p className="text-xs text-muted-foreground">
                            We typically respond within 24-48 hours during business days.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Leaf className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-serif font-semibold text-sm mb-1">Our Mission</h3>
                          <p className="text-xs text-muted-foreground">
                            Reducing food waste one small recipe at a time
                            <br />
                            Serving conscious cooks worldwide
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/10 to-secondary/5 border-primary/20 shadow-lg">
                  <CardContent className="p-4 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                      <Leaf className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-serif font-semibold text-base">Recipe Ideas</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Have a favorite dish you'd like to see in mini portions? We love creating small-batch versions of
                      classic recipes that eliminate waste!
                    </p>
                    <div className="pt-1">
                      <div className="text-xs text-muted-foreground font-medium">Join 50K+ women reducing food waste</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <h2 className="text-2xl lg:text-3xl font-serif font-bold text-center mb-8">Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                <Card className="shadow-sm border-0 bg-background/50">
                  <CardContent className="p-4 lg:p-6 space-y-3">
                    <h3 className="font-serif font-semibold text-base lg:text-lg">How do I scale recipes?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Our recipes are designed for 1-2 servings, but you can easily scale them up. Use our portion calculator or contact our recipe support team for help with ingredient adjustments.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0 bg-background/50">
                  <CardContent className="p-4 lg:p-6 space-y-3">
                    <h3 className="font-serif font-semibold text-base lg:text-lg">Can I suggest recipe ideas?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Absolutely! We love hearing from our community. Send us your recipe requests through the contact form above, and we'll work on creating mini versions of your favorite dishes.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0 bg-background/50">
                  <CardContent className="p-4 lg:p-6 space-y-3">
                    <h3 className="font-serif font-semibold text-base lg:text-lg">Do you offer meal planning?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Yes! We provide weekly meal plans designed for small households. Contact us to learn more about our personalized meal planning services for busy women.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0 bg-background/50">
                  <CardContent className="p-4 lg:p-6 space-y-3">
                    <h3 className="font-serif font-semibold text-base lg:text-lg">How can I reduce food waste?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Our recipes are specifically designed to use ingredients completely. Check out our zero-waste cooking tips and follow our portion-controlled recipes to minimize waste.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
