import { MetadataRoute } from 'next'
import { getRobotsConfig } from '@/lib/config'
 
export default function robots(): MetadataRoute.Robots {
  const robotsConfig = getRobotsConfig()
  
  return {
    rules: robotsConfig.rules.map(rule => ({
      userAgent: rule.userAgent,
      allow: rule.allow,
      disallow: rule.disallow,
      crawlDelay: rule.crawlDelay,
    })),
    sitemap: robotsConfig.sitemap,
    host: robotsConfig.host,
  }
}
