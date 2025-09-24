import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { PageBreadcrumb } from "@/components/page-breadcrumb"

export const metadata: Metadata = {
  title: "Privacy Policy - Mini Recipe | Data Protection & Your Rights",
  description:
    "Learn how Mini Recipe collects, uses, and protects your personal information. Complete privacy policy covering cookies, analytics, advertising, and your data rights under GDPR and CCPA.",
  keywords: [
    "privacy policy", 
    "data protection", 
    "cookies", 
    "gdpr", 
    "ccpa", 
    "user rights", 
    "data security", 
    "mini recipe privacy",
    "food blog privacy",
    "personal information protection"
  ],
  openGraph: {
    title: "Privacy Policy - Mini Recipe",
    description: "Our commitment to protecting your privacy and personal information when you visit Mini Recipe.",
    type: "article",
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <PageBreadcrumb />
      <main className="flex-1">
        <div className="py-16">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl lg:text-5xl font-serif font-bold">Privacy Policy</h1>
                <p className="text-muted-foreground">Last updated: September 17, 2025</p>
              </div>

              <Card>
                <CardContent className="p-8 space-y-8">
                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Introduction</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      At Mini Recipe, we are committed to protecting your privacy and ensuring the security of your
                      personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard
                      your information when you visit our website or use our services to discover small-portion recipes
                      and sustainable cooking practices.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Information We Collect</h2>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Personal Information</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        We may collect the following personal information when you interact with our website:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                        <li>Email address (when you subscribe to our newsletter)</li>
                        <li>Name (if provided when leaving comments or contacting us)</li>
                        <li>Communication preferences and interests</li>
                        <li>Recipe feedback and ratings</li>
                      </ul>

                      <h3 className="text-lg font-semibold">Automatically Collected Information</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        When you visit our website, we automatically collect certain information:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                        <li>IP address and general location</li>
                        <li>Browser type and version</li>
                        <li>Device information and screen resolution</li>
                        <li>Pages visited and time spent on our website</li>
                        <li>Referring website information</li>
                        <li>Search terms used to find our recipes</li>
                      </ul>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">How We Use Your Information</h2>
                    <p className="text-muted-foreground leading-relaxed">We use the information we collect to:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Provide and maintain our website and mini recipe services</li>
                      <li>Send you our newsletter with new small-portion recipes (with your consent)</li>
                      <li>Respond to your comments, questions, and recipe requests</li>
                      <li>Improve our website and develop better portion-control recipes</li>
                      <li>Analyze website usage and cooking trends</li>
                      <li>Personalize your experience and show relevant content</li>
                      <li>Comply with legal obligations</li>
                      <li>Prevent fraud and ensure website security</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Cookies and Tracking Technologies</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We use cookies and similar tracking technologies to enhance your browsing experience:
                    </p>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">Essential Cookies</h4>
                        <p className="text-muted-foreground text-sm">Required for website functionality and cannot be disabled.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Analytics Cookies</h4>
                        <p className="text-muted-foreground text-sm">Help us understand how visitors interact with our recipe content using Google Analytics.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Advertising Cookies</h4>
                        <p className="text-muted-foreground text-sm">Used by Google AdSense and other advertising partners to show relevant ads.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Social Media Cookies</h4>
                        <p className="text-muted-foreground text-sm">Enable social sharing features for our recipes on platforms like Pinterest and Instagram.</p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Information Sharing and Disclosure</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li><strong>Service Providers:</strong> With trusted third-party services that help us operate our website (email providers, analytics services)</li>
                      <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                      <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of our website</li>
                      <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Third-Party Services</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Our website integrates with several third-party services:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li><strong>Google Analytics:</strong> For website traffic analysis and user behavior insights</li>
                      <li><strong>Google AdSense:</strong> For displaying relevant advertisements</li>
                      <li><strong>Email Service Providers:</strong> For newsletter delivery and communication</li>
                      <li><strong>Social Media Platforms:</strong> For recipe sharing and community engagement</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                      These services have their own privacy policies and data collection practices.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Data Security</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We implement appropriate technical and organizational security measures to protect your personal information:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>SSL encryption for data transmission</li>
                      <li>Secure hosting with regular security updates</li>
                      <li>Limited access to personal information on a need-to-know basis</li>
                      <li>Regular security audits and monitoring</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Your Rights and Choices</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Depending on your location, you may have the following rights regarding your personal information:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                      <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                      <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                      <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                      <li><strong>Data Portability:</strong> Request your data in a machine-readable format</li>
                      <li><strong>Object:</strong> Object to certain types of data processing</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                      To exercise these rights, please contact us using the information provided below.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Children's Privacy</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Our website is intended for adults and we do not knowingly collect personal information from children under 13. 
                      If we discover that we have collected information from a child under 13, we will delete it immediately.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">International Data Transfers</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Your information may be processed and stored in the United States or other countries where our service 
                      providers operate. We ensure appropriate safeguards are in place for international data transfers.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Changes to This Privacy Policy</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We may update this Privacy Policy from time to time. When we make changes, we will update the "Last Updated" 
                      date and notify you through our website or email if the changes are significant.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Contact Us</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      If you have any questions about this Privacy Policy, want to exercise your privacy rights, or have concerns about our privacy practices, please contact us:
                    </p>
                    <div className="bg-muted/50 p-6 rounded-lg mt-4 space-y-3">
                      <div>
                        <strong className="text-sm">Email:</strong>
                        <p className="text-sm">privacy@minirecipe.com</p>
                      </div>
                      <div>
                        <strong className="text-sm">Business Information:</strong>
                        <p className="text-sm">
                          Mini Recipe<br />
                          <em>For privacy requests, please use email contact above</em>
                        </p>
                      </div>
                      <div>
                        <strong className="text-sm">Response Time:</strong>
                        <p className="text-sm">We will respond to your privacy requests within 30 days.</p>
                      </div>
                    </div>
                  </section>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
