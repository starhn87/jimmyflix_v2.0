import { createSitemap } from '@/lib/sitemap'
import { absoluteUrl } from '@/lib/seo'
import { sitemapPageCount, sitemapPagePaths, type SitemapRegistry } from '@/lib/sitemap-registry'

const escapeXml = (value: string) => value.replace(/[<>&"']/g, (character) => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
})[character]!)
const declaration = '<?xml version="1.0" encoding="UTF-8"?>'
export const SITEMAP_RESPONSE_HEADERS = { 'Content-Type': 'application/xml; charset=utf-8', 'X-Content-Type-Options': 'nosniff' }

export function sitemapIndexXml(registry: SitemapRegistry) {
  const children = Array.from({ length: sitemapPageCount(registry) }, (_, page) =>
    `<sitemap><loc>${escapeXml(absoluteUrl(`/sitemaps/${page}.xml`))}</loc></sitemap>`,
  ).join('')
  return `${declaration}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${children}</sitemapindex>`
}

export function sitemapPageXml(registry: SitemapRegistry, page: number) {
  const children = createSitemap(sitemapPagePaths(registry, page)).map((entry) => {
    const languages = Object.entries(entry.alternates?.languages || {}).map(([language, href]) =>
      `<xhtml:link rel="alternate" hreflang="${escapeXml(language)}" href="${escapeXml(String(href))}"/>`,
    ).join('')
    const images = (entry.images || []).map((url) => `<image:image><image:loc>${escapeXml(url)}</image:loc></image:image>`).join('')
    return `<url><loc>${escapeXml(entry.url)}</loc>${languages}${images}</url>`
  }).join('')
  return `${declaration}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${children}</urlset>`
}
