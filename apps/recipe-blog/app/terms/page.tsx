import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { PageBreadcrumb } from "@/components/page-breadcrumb"

export const metadata: Metadata = {
  title: "Terms of Service - Mini Recipe | User Agreement & Legal Terms",
  description:
    "Read Mini Recipe's comprehensive terms of service and user agreement. Learn about your rights, responsibilities, recipe usage rights, and legal terms when using our small-portion recipe platform.",
  keywords: [
    "terms of service", 
    "user agreement", 
    "legal terms", 
    "recipe usage rights",
    "mini recipe terms", 
    "food blog terms",
    "user responsibilities",
    "website terms",
    "legal agreement",
    "content usage"
  ],
  openGraph: {
    title: "Terms of Service - Mini Recipe",
    description: "User agreement and legal terms for using Mini Recipe's small-portion recipe platform.",
    type: "article",
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <PageBreadcrumb />
      <main className="flex-1">
        <div className="py-16">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl lg:text-5xl font-serif font-bold">Terms of Service</h1>
                <p className="text-muted-foreground">Last updated: September 17, 2025</p>
              </div>

              <Card>
                <CardContent className="p-8 space-y-8">
                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Agreement to Terms</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      By accessing and using Mini Recipe ("we," "our," or "us"), you accept and agree to be bound by the
                      terms and provision of this agreement. If you do not agree to abide by the above, please do not
                      use this service. These terms apply to all users of the website, including casual visitors and registered users.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Description of Service</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Mini Recipe is a food blog providing small-portion recipes, cooking tips, and sustainable cooking practices 
                      for busy American women. Our services include:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Free access to mini recipe content and cooking guides</li>
                      <li>Optional newsletter subscription with weekly recipes</li>
                      <li>Recipe rating and comment features</li>
                      <li>Social sharing capabilities</li>
                      <li>Search and filtering functionality</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">User Accounts and Registration</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      While most of our content is freely accessible, some features may require registration:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>You must provide accurate and complete information when registering</li>
                      <li>You are responsible for maintaining the security of your account</li>
                      <li>You must notify us immediately of any unauthorized use</li>
                      <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Acceptable Use Policy</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      When using Mini Recipe, you agree not to:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Post spam, offensive, or inappropriate content in comments</li>
                      <li>Attempt to hack, disrupt, or overload our website</li>
                      <li>Use automated tools to scrape or download our content</li>
                      <li>Impersonate other users or provide false information</li>
                      <li>Violate any applicable laws or regulations</li>
                      <li>Infringe on intellectual property rights</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Use License</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Permission is granted to temporarily download one copy of the materials on Mini Recipe's website
                      for personal, non-commercial transitory viewing only. This is the grant of a license, not a
                      transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>modify or copy the materials for redistribution</li>
                      <li>use the materials for any commercial purpose or for any public display</li>
                      <li>attempt to reverse engineer any software contained on the website</li>
                      <li>remove any copyright or other proprietary notations from the materials</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Recipe Usage and Intellectual Property</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Our recipes and content are protected by copyright. You may:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Cook our recipes for personal and family consumption</li>
                      <li>Share links to our recipes on social media with proper attribution</li>
                      <li>Print recipes for personal use only</li>
                      <li>Adapt recipes for dietary restrictions (personal use only)</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      You may not republish, redistribute, copy, or use our recipes, photos, or content for commercial purposes 
                      without written permission. This includes food blogs, restaurants, catering businesses, or any monetized platforms.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">User-Generated Content</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      When you submit comments, reviews, photos, or other content to Mini Recipe, you:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, modify, and display such content</li>
                      <li>Represent that you own or have the necessary rights to the content you submit</li>
                      <li>Agree that your content may be featured in our marketing materials</li>
                      <li>Understand that we may moderate, edit, or remove content at our discretion</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Advertising and Third-Party Links</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Mini Recipe may display advertisements and contain links to third-party websites:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>We use Google AdSense and other advertising networks to display relevant ads</li>
                      <li>We are not responsible for the content or practices of third-party websites</li>
                      <li>Clicking on ads or third-party links is at your own risk</li>
                      <li>We may earn commissions from affiliate links (clearly disclosed)</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Food Safety and Health Disclaimers</h2>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <p className="text-muted-foreground leading-relaxed font-medium">
                        <strong>Important:</strong> While we strive to provide accurate cooking instructions and food safety guidelines, 
                        you are solely responsible for following proper food safety practices.
                      </p>
                    </div>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Always check ingredient freshness and expiration dates</li>
                      <li>Follow proper cooking temperatures and food handling procedures</li>
                      <li>Consider any food allergies or dietary restrictions</li>
                      <li>Consult healthcare providers for specific dietary advice</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                      Mini Recipe is not liable for any foodborne illness, allergic reactions, or health issues resulting from the use of our recipes.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Disclaimers and Warranties</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      The materials on Mini Recipe's website are provided on an 'as is' basis. Mini Recipe makes no
                      warranties, expressed or implied, and hereby disclaims and negates all other warranties including
                      without limitation, implied warranties or conditions of merchantability, fitness for a particular
                      purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Limitation of Liability</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      In no event shall Mini Recipe or its suppliers be liable for any damages (including, without
                      limitation, damages for loss of data or profit, or due to business interruption) arising out of
                      the use or inability to use the materials on Mini Recipe's website, even if Mini Recipe or a Mini
                      Recipe authorized representative has been notified orally or in writing of the possibility of such
                      damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations 
                      of liability for consequential or incidental damages, these limitations may not apply to you.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Privacy and Data Collection</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Your privacy is important to us. Please review our Privacy Policy, which also governs your use of 
                      the website, to understand our practices regarding data collection and use. By using our website, 
                      you consent to the collection and use of information as described in our Privacy Policy.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Accuracy of Materials</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      The materials appearing on Mini Recipe's website could include technical, typographical, or
                      photographic errors. Mini Recipe does not warrant that any of the materials on its website are
                      accurate, complete, or current. Mini Recipe may make changes to the materials contained on its
                      website at any time without notice. However, we make every effort to ensure recipe accuracy 
                      and provide the best cooking experience possible.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Termination</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We may terminate or suspend your access to our website immediately, without prior notice or liability, 
                      for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, 
                      your right to use the website will cease immediately.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Governing Law</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      These terms and conditions are governed by and construed in accordance with the laws of the United States, 
                      and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Changes to Terms</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Mini Recipe may revise these terms of service for its website at any time without notice. By using
                      this website, you are agreeing to be bound by the then current version of these terms of service.
                      We recommend reviewing these terms periodically for any changes.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Contact Information</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      If you have any questions about these Terms of Service, please contact us:
                    </p>
                    <div className="bg-muted/50 p-6 rounded-lg mt-4 space-y-3">
                      <div>
                        <strong className="text-sm">Email:</strong>
                        <p className="text-sm">legal@minirecipe.net</p>
                      </div>
                      <div>
                        <strong className="text-sm">Business Information:</strong>
                        <p className="text-sm">
                          Mini Recipe<br />
                          <em>For legal inquiries, please use email contact above</em>
                        </p>
                      </div>
                      <div>
                        <strong className="text-sm">Response Time:</strong>
                        <p className="text-sm">We will respond to legal inquiries within 5-7 business days.</p>
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
