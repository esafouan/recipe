import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { getPageConfig } from "@/lib/config"

const termsConfig = getPageConfig('terms') as any // Type assertion for now

export const metadata: Metadata = {
  title: `${termsConfig.title}`,
  description: termsConfig.description,
  keywords: termsConfig.keywords,
  openGraph: {
    title: termsConfig.openGraph.title,
    description: termsConfig.openGraph.description,
    type: termsConfig.openGraph.type,
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="py-16">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl lg:text-5xl font-serif font-bold">{termsConfig.title}</h1>
                <p className="text-muted-foreground">Last updated: {termsConfig.lastUpdated}</p>
              </div>

              <Card>
                <CardContent className="p-8 space-y-8">
                  {termsConfig.sections.map((section: any, index: number) => (
                    <section key={index} className="space-y-4">
                      <h2 className="text-2xl font-serif font-bold">{section.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                    </section>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
