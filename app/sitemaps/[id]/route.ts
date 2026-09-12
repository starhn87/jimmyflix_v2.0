import { getSitemapRegistry } from '@/lib/sitemap-store'
import { sitemapPageCount } from '@/lib/sitemap-registry'
import { sitemapPageXml, SITEMAP_RESPONSE_HEADERS } from '@/lib/sitemap-xml'

export const revalidate = 86400

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^(0|[1-9]\d*)\.xml$/.test(id)) return new Response('Not found', { status: 404 })
  const page = Number(id.slice(0, -4))
  const registry = await getSitemapRegistry()
  if (!Number.isSafeInteger(page) || page >= sitemapPageCount(registry)) return new Response('Not found', { status: 404 })
  return new Response(sitemapPageXml(registry, page), { headers: SITEMAP_RESPONSE_HEADERS })
}
