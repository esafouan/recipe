import type { Metadata } from "next"
import { ContactForm } from "@/components/contact-form"
import { ChefProfileCard } from "@/components/chef-profile-card"
import { HeroSection } from "@/components/hero-section-with-breadcrumb"
import { getContactPageData, getChefData } from "@/lib/site-config"

const contactData = getContactPageData()
const chefData = getChefData()

// Generate breadcrumbs
const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Contact" }
]

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
        {/* Hero Section with Breadcrumbs */}
        <HeroSection
          title={contactData.hero.title}
          description={contactData.hero.description}
          breadcrumbs={breadcrumbs}
          cta={{
            text: contactData.hero.ctaText,
            href: contactData.hero.ctaTarget,
            variant: "primary"
          }}
        />

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
