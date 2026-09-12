import { getSitemapRegistry } from '@/lib/sitemap-store'
import { sitemapIndexXml, SITEMAP_RESPONSE_HEADERS } from '@/lib/sitemap-xml'

export const revalidate = 86400

export async function GET() {
  return new Response(sitemapIndexXml(await getSitemapRegistry()), { headers: SITEMAP_RESPONSE_HEADERS })
}
