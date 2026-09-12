import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    // Search pages must remain crawlable so crawlers can read their noindex tag.
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/_vercel/'] },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
