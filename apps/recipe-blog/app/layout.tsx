import type React from "react"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Mini Recipe - Small Batch Recipes for 1-2 People",
  description: "Discover perfectly portioned recipes designed for small households. No more food waste - just delicious meals sized right for you.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://minirecipe.net'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen">
          <SiteHeader />
          <main>
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
