import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Privacy Policy - Cozy Bites Kitchen",
  description: "Privacy Policy for Cozy Bites Kitchen. Learn how we collect, use, and protect your personal information.",
  keywords: ["privacy policy", "data protection", "cookies", "gdpr", "ccpa", "cozy bites kitchen"],
  openGraph: {
    title: "Privacy Policy - Cozy Bites Kitchen",
    description: "Our commitment to protecting your privacy and personal information.",
    type: "article",
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
                <h1 className="text-4xl lg:text-5xl font-serif font-bold">Privacy Policy</h1>
                <p className="text-muted-foreground">Last Updated: 22/01/2026</p>
              </div>

              <Card>
                <CardContent className="p-8 space-y-8">
                  {/* Introduction */}
                  <section className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      At cozybiteskitchen.com, we respect your privacy and are committed to protecting it. 
                      This Privacy Policy explains how information is collected, used, disclosed, and safeguarded when you visit this website.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm"><strong>Website Owner / Author:</strong> Sarah Mitchell</p>
                      <p className="text-sm"><strong>Contact Email:</strong> hello@cozybiteskitchen.com</p>
                    </div>
                  </section>

                  {/* 1. Information We Collect */}
                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">1. Information We Collect</h2>
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">1.1 Personal Information</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        We may collect personal information that you voluntarily provide, including your name, email address, 
                        and any information submitted through contact forms, comments, or subscriptions.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">1.2 Usage & Technical Data</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        When you browse cozybiteskitchen.com, certain information is collected automatically, such as IP address, 
                        browser type, device information, pages visited, time spent on pages, and referring URLs.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">1.3 Cookies & Tracking Technologies</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        We use cookies, pixels, and similar tracking technologies to improve functionality, analyze traffic, and support advertising.
                      </p>
                    </div>
                  </section>

                  {/* 2. How Information Is Collected */}
                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">2. How Information Is Collected</h2>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>When you subscribe to newsletters or updates</li>
                      <li>When you contact us via forms or comments</li>
                      <li>When you browse the website through cookies and analytics tools</li>
                    </ul>
                  </section>

                  {/* 3. How We Use Your Information */}
                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">3. How We Use Your Information</h2>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>To operate and maintain the website</li>
                      <li>To improve content and user experience</li>
                      <li>To communicate with users who opt in</li>
                      <li>To analyze traffic and performance</li>
                      <li>To maintain site security and prevent abuse</li>
                    </ul>
                  </section>

                  {/* 4. Cookies Policy */}
                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">4. Cookies Policy</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Cookies are used to remember user preferences, measure site performance, and serve personalized or non-personalized advertisements. 
                      You may disable cookies through your browser settings; however, some site features may not function properly.
                    </p>
                  </section>

                  {/* 5. Advertising & Ezoic Disclosure */}
                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">5. Advertising & Ezoic Disclosure</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      cozybiteskitchen.com uses Ezoic Inc. to manage and optimize third-party advertising.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Ezoic and its partners may collect and use data such as IP address, cookies, and browsing behavior for ad personalization, 
                      measurement, analytics, and to improve user experience.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      To comply with Ezoic requirements, the official Ezoic privacy disclosures are embedded below:
                    </p>
                    
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <span id="ezoic-privacy-policy-embed"></span>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      You can review Ezoic&apos;s full privacy policy here:{" "}
                      <a 
                        href="https://g.ezoic.net/privacy/cozybiteskitchen.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        https://g.ezoic.net/privacy/cozybiteskitchen.com
                      </a>
                    </p>
                  </section>

                  {/* 6. Third-Party Services */}
                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">6. Third-Party Services</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We may share limited data with trusted third-party services such as advertising partners, analytics providers, 
                      and legal authorities when required by law. We do not sell or trade personal information.
                    </p>
                  </section>

                  {/* 7. Affiliate & Advertising Programs */}
                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">7. Affiliate & Advertising Programs</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      cozybiteskitchen.com may participate in advertising and affiliate programs, including Google AdSense or similar platforms. 
                      These services may use cookies or web beacons to display relevant ads.
                    </p>
                  </section>

                  {/* 8. Data Protection & Security */}
                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">8. Data Protection & Security</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We use reasonable security measures such as SSL encryption and restricted access to protect your data. 
                      However, no online transmission or storage system is completely secure.
                    </p>
                  </section>

                  {/* 9. Your Privacy Rights */}
                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">9. Your Privacy Rights</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Depending on your location, you may have the right to access, update, or delete your personal data, 
                      opt out of communications, or control ad personalization. Requests can be sent to{" "}
                      <a href="mailto:hello@cozybiteskitchen.com" className="text-primary hover:underline">
                        hello@cozybiteskitchen.com
                      </a>.
                    </p>
                  </section>

                  {/* 10. Children's Information (COPPA) */}
                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">10. Children&apos;s Information (COPPA)</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      cozybiteskitchen.com does not knowingly collect personal information from children under the age of 13. 
                      Any such information discovered will be deleted promptly.
                    </p>
                  </section>

                  {/* 11. Legal Compliance */}
                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">11. Legal Compliance</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      This website complies with applicable privacy laws, including the California Online Privacy Protection Act (CalOPPA) 
                      and the Children&apos;s Online Privacy Protection Act (COPPA).
                    </p>
                  </section>

                  {/* 12. Data Breach Policy */}
                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">12. Data Breach Policy</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      In the event of a data breach, affected users will be notified within 7 business days where legally required.
                    </p>
                  </section>

                  {/* 13. Changes to This Policy */}
                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">13. Changes to This Policy</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      This Privacy Policy may be updated at any time. Any changes will be reflected by the &quot;Last Updated&quot; date at the top of this page.
                    </p>
                  </section>

                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
