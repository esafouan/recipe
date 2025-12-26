import { MetadataRoute } from 'next'

const FRONTEND_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://modernkitchen.net'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      }
    ],
    sitemap: `${FRONTEND_URL}/sitemap.xml`,
    host: FRONTEND_URL,
  }
}
