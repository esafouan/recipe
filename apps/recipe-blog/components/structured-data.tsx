export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://minirecipe.net/#website",
        "url": "https://minirecipe.net/",
        "name": "Mini Recipe",
        "description": "Perfect portions for busy American women. 500+ mini recipes designed to eliminate food waste and save time.",
        "publisher": {
          "@id": "https://minirecipe.net/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://minirecipe.net/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": "https://minirecipe.net/#organization",
        "name": "Mini Recipe",
        "url": "https://minirecipe.net/",
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "en-US",
          "@id": "https://minirecipe.net/#/schema/logo/image/",
          "url": "https://minirecipe.net/logo.png",
          "contentUrl": "https://minirecipe.net/logo.png",
          "width": 200,
          "height": 200,
          "caption": "Mini Recipe"
        },
        "image": {
          "@id": "https://minirecipe.net/#/schema/logo/image/"
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
        "@id": "https://minirecipe.net/#webpage",
        "url": "https://minirecipe.net/",
        "name": "Mini Recipe - Perfect Portions for Busy American Women | Zero Food Waste Cooking",
        "isPartOf": {
          "@id": "https://minirecipe.net/#website"
        },
        "about": {
          "@id": "https://minirecipe.net/#organization"
        },
        "description": "Discover 500+ mini recipes perfect for 1-2 servings. Join 50,000+ American women reducing food waste with our small-batch cooking guides.",
        "breadcrumb": {
          "@id": "https://minirecipe.net/#breadcrumb"
        },
        "inLanguage": "en-US",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [
              "https://minirecipe.net/"
            ]
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://minirecipe.net/#breadcrumb",
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
