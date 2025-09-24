export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://minirecipe.com/#website",
        "url": "https://minirecipe.com/",
        "name": "Mini Recipe",
        "description": "Perfect portions for busy American women. 500+ mini recipes designed to eliminate food waste and save time.",
        "publisher": {
          "@id": "https://minirecipe.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://minirecipe.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": "https://minirecipe.com/#organization",
        "name": "Mini Recipe",
        "url": "https://minirecipe.com/",
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "en-US",
          "@id": "https://minirecipe.com/#/schema/logo/image/",
          "url": "https://minirecipe.com/logo.png",
          "contentUrl": "https://minirecipe.com/logo.png",
          "width": 200,
          "height": 200,
          "caption": "Mini Recipe"
        },
        "image": {
          "@id": "https://minirecipe.com/#/schema/logo/image/"
        },
        "sameAs": [
          "https://facebook.com/minirecipe",
          "https://instagram.com/minirecipe",
          "https://pinterest.com/minirecipe",
          "https://twitter.com/minirecipe"
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://minirecipe.com/#webpage",
        "url": "https://minirecipe.com/",
        "name": "Mini Recipe - Perfect Portions for Busy American Women | Zero Food Waste Cooking",
        "isPartOf": {
          "@id": "https://minirecipe.com/#website"
        },
        "about": {
          "@id": "https://minirecipe.com/#organization"
        },
        "description": "Discover 500+ mini recipes perfect for 1-2 servings. Join 50,000+ American women reducing food waste with our small-batch cooking guides.",
        "breadcrumb": {
          "@id": "https://minirecipe.com/#breadcrumb"
        },
        "inLanguage": "en-US",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [
              "https://minirecipe.com/"
            ]
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://minirecipe.com/#breadcrumb",
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
