import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { SiteConfig } from "@/lib/config"

type ChefData = SiteConfig['pages']['about']['chef']

interface ChefProfileCardProps {
  chefData: ChefData
  variant?: 'about' | 'contact'
  className?: string
}

export function ChefProfileCard({ 
  chefData, 
  variant = 'contact',
  className = "" 
}: ChefProfileCardProps) {
  return (
    <div className={`lg:col-span-1 ${className}`}>
      <div className="sticky top-16">
        {/* Chef Profile Card */}
        <Card className="bg-white shadow-lg border-2 border-primary/20 mb-8">
          <CardContent className="p-6 text-center">
            {/* Profile Image */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-lg">
                <Image
                  src={chefData.image}
                  alt={chefData.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name and Title */}
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">
              {chefData.greeting}
            </h3>
            
            {/* Description */}
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {chefData.description}
            </p>

            {/* Social/Contact Button */}
            <div className="flex justify-center mb-4">
                  <Link
                  href={chefData.social.pinterest.url}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={chefData.social.pinterest.label}
                >

                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.013C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </div>

                </Link>
            </div>

            {/* Learn More Button - Only show for contact variant */}
            {variant === 'contact' && (
              <a
                href="/about"
                className="inline-block w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                LEARN MORE
              </a>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
