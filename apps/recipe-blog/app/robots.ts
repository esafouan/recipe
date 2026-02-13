import { MetadataRoute } from 'next'

const FRONTEND_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://modernkitchen.net'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', 
          '/admin/', 
          '/_next/',
          '/search',        // Block search URLs
          '/search?*',      // Block search with parameters
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/', 
          '/admin/',
          '/search',        // Block search URLs
          '/search?*',      // Block search with parameters
        ],
      }
    ],
    sitemap: `${FRONTEND_URL}/sitemap.xml`,
    host: FRONTEND_URL,
  }
}
