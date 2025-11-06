import { getSeoConfig, getSiteConfig } from '@/lib/config'

export function StructuredData() {
  const siteConfig = getSiteConfig()
  const seoConfig = getSeoConfig()
  
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...seoConfig.structuredData.website,
        "@id": `${siteConfig.url}/#website`,
        "url": `${siteConfig.url}/`,
        "name": siteConfig.name,
        "publisher": {
          "@id": `${siteConfig.url}/#organization`
        }
      },
      {
        ...seoConfig.structuredData.organization,
        "@id": `${siteConfig.url}/#organization`,
        "url": `${siteConfig.url}/`,
        "name": siteConfig.name,
        "logo": {
          "@type": "ImageObject",
          "inLanguage": seoConfig.structuredData.website.inLanguage,
          "@id": `${siteConfig.url}/#/schema/logo/image/`,
          "url": siteConfig.logo.startsWith('http') ? siteConfig.logo : `${siteConfig.url}${siteConfig.logo}`,
          "contentUrl": siteConfig.logo.startsWith('http') ? siteConfig.logo : `${siteConfig.url}${siteConfig.logo}`,
          "width": 200,
          "height": 200,
          "caption": siteConfig.name
        },
        "image": {
          "@id": `${siteConfig.url}/#/schema/logo/image/`
        }
      },
      {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/#webpage`,
        "url": `${siteConfig.url}/`,
        "name": siteConfig.title,
        "isPartOf": {
          "@id": `${siteConfig.url}/#website`
        },
        "about": {
          "@id": `${siteConfig.url}/#organization`
        },
        "description": siteConfig.description,
        "breadcrumb": {
          "@id": `${siteConfig.url}/#breadcrumb`
        },
        "inLanguage": seoConfig.structuredData.website.inLanguage,
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [
              `${siteConfig.url}/`
            ]
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteConfig.url}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home"
          }
        ]
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
