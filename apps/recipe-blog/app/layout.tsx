import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { StructuredData } from "@/components/structured-data"
import { inter, playfair, fontVariables } from "@/lib/fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mini Recipe - Perfect Portions for Busy American Women | Zero Food Waste Cooking",
  description:
    "Discover 500+ mini recipes perfect for 1-2 servings. Join 50,000+ American women reducing food waste with our small-batch cooking guides. Quick, healthy, sustainable recipes for busy lifestyles.",
  generator: "Next.js",
  applicationName: "Mini Recipe",
  keywords: [
    "mini recipes",
    "small batch cooking", 
    "single serving recipes",
    "food waste reduction",
    "sustainable cooking",
    "portion control recipes",
    "quick healthy meals",
    "eco-friendly cooking",
    "American women cooking",
    "busy mom recipes",
    "zero waste kitchen",
    "meal prep for one",
  ],
  authors: [{ name: "Mini Recipe Team", url: "https://minirecipe.net" }],
  creator: "Mini Recipe",
  publisher: "Mini Recipe",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://minirecipe.net"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mini Recipe - Perfect Portions for Busy American Women",
    description: "Discover 500+ mini recipes perfect for 1-2 servings. Join 50,000+ American women reducing food waste with small-batch cooking.",
    url: "https://minirecipe.net",
    siteName: "Mini Recipe",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mini Recipe - Small batch cooking for busy women",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mini Recipe - Perfect Portions for Busy Women",
    description: "500+ mini recipes for 1-2 servings. Zero food waste cooking for busy American women.",
    images: ["/og-image.jpg"],
    creator: "@minirecipe",
    site: "@minirecipe",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "food",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="p:domain_verify" content="ab552ac2d12dbf81c53e0cf20c40d964"/>
      </head>
      <body className={`${fontVariables} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <SpeedInsights />
        {process.env.NODE_ENV === 'production' && (
          <script
            defer
            src="/_vercel/insights/script.js"
            data-endpoint="/_vercel/insights"
          />
        )}
      </body>
    </html>
  )
}
