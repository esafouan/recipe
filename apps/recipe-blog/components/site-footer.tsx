import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-primary">Mini Recipe</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Perfect portions for busy women. Small batch recipes designed to eliminate food waste and save time 
              in the kitchen.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-sans font-semibold">Recipes</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/recipes/breakfast"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Breakfast
                </Link>
              </li>
              <li>
                <Link href="/recipes/lunch" className="text-muted-foreground hover:text-primary transition-colors">
                  Lunch
                </Link>
              </li>
              <li>
                <Link href="/recipes/dinner" className="text-muted-foreground hover:text-primary transition-colors">
                  Dinner
                </Link>
              </li>
              <li>
                <Link
                  href="recipes/dessert"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Desserts
                </Link>
              </li>
              <li>
                <Link
                  href="recipes/healthy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Healthy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-sans font-semibold">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-sans font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Mahdi Dev. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
