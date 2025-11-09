import Link from "next/link"
import Image from "next/image"
import { Facebook } from "lucide-react"
import { getSiteConfig } from "@/lib/config"

// Pinterest icon component
const PinterestIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.013C24.007 5.367 18.641.001 12.017.001z"/>
  </svg>
)

export function SiteFooter() {
  const siteConfig = getSiteConfig()

  // Icon mapping
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />
      case 'pinterest':
        return <PinterestIcon />
      default:
        return <Facebook className="h-5 w-5" />
    }
  }

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Image 
              src="/logonobg.png" 
              alt="Mini Recipe Logo" 
              width={120} 
              height={80} 
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {siteConfig.footerDescription}
            </p>
            <div className="flex space-x-4">
              {siteConfig.footerSocialMedia.map((social) => (
                <Link 
                  key={social.name}
                  href={social.url} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.name}
                >
                  {getIcon(social.icon)}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-sans font-semibold">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/recipes"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Recipes
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  Categories
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
