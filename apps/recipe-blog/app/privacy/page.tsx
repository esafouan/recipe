import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { getPageConfig } from "@/lib/config"

const privacyConfig = getPageConfig('privacy') as any // Type assertion for now

export const metadata: Metadata = {
  title: `${privacyConfig.title} - Mini Recipe | Data Protection & Your Rights`,
  description: privacyConfig.description,
  keywords: privacyConfig.keywords,
  openGraph: {
    title: privacyConfig.openGraph.title,
    description: privacyConfig.openGraph.description,
    type: privacyConfig.openGraph.type,
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="py-16">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl lg:text-5xl font-serif font-bold">{privacyConfig.title}</h1>
                <p className="text-muted-foreground">Last updated: {privacyConfig.lastUpdated}</p>
              </div>

              <Card>
                <CardContent className="p-8 space-y-8">
                  {privacyConfig.sections.map((section: any, index: number) => (
                    <section key={index} className="space-y-4">
                      <h2 className="text-2xl font-serif font-bold">{section.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                      
                      {section.subsections && (
                        <div className="space-y-4">
                          {section.subsections.map((subsection: any, subIndex: number) => (
                            <div key={subIndex}>
                              <h3 className="text-lg font-semibold">{subsection.title}</h3>
                              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                {subsection.items.map((item: string, itemIndex: number) => (
                                  <li key={itemIndex}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {section.items && (
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                          {section.items.map((item: string, itemIndex: number) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      )}
                      
                      {section.contact && (
                        <div className="bg-muted/50 p-6 rounded-lg mt-4 space-y-3">
                          <div>
                            <strong className="text-sm">Email:</strong>
                            <p className="text-sm">{section.contact.email}</p>
                          </div>
                          <div>
                            <strong className="text-sm">Business Information:</strong>
                            <p className="text-sm">
                              {section.contact.business}<br />
                              <em>{section.contact.note}</em>
                            </p>
                          </div>
                          <div>
                            <strong className="text-sm">Response Time:</strong>
                            <p className="text-sm">{section.contact.responseTime}</p>
                          </div>
                        </div>
                      )}
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
