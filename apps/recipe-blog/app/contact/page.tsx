import type { Metadata } from "next"
import { ContactForm } from "@/components/contact-form"
import { ChefProfileCard } from "@/components/chef-profile-card"
import { getContactPageData, getChefData } from "@/lib/site-config"

const contactData = getContactPageData()
const chefData = getChefData()

export const metadata: Metadata = {
  title: contactData.title,
  description: contactData.description,
  keywords: contactData.keywords,
  openGraph: contactData.openGraph,
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="text-center space-y-6 md:space-y-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
                {contactData.hero.title}
              </h1>
              
              <div className="max-w-3xl mx-auto space-y-6">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  {contactData.hero.description}
                </p>

                {/* Call to action */}
                <div className="pt-4">
                  <a
                    href={contactData.hero.ctaTarget}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    {contactData.hero.ctaText}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left Content - Contact Info and Image */}
              <div className="lg:col-span-2 space-y-8">
                {/* Content Grid - Image Left, Text Right */}

                {/* Contact Information Box */}
                <div id="contact-form" className="bg-white rounded-2xl shadow-lg p-8 border-2 border-primary/20">
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">{contactData.contactInfo.title}</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {contactData.contactInfo.description}
                  </p>
                  
                  {/* Contact Form */}
                  <ContactForm />
                </div>
              </div>

              {/* Right Sidebar - Chef Profile Card */}
              <ChefProfileCard chefData={chefData} variant="contact" />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
