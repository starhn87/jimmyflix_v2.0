import { revalidatePath, revalidateTag } from 'next/cache'
import { isCronAuthorized } from '@/lib/cron-auth'
import { collectSitemap } from '@/lib/sitemap-collector'
import { readSitemapSnapshot, writeSitemapSnapshot, SITEMAP_CACHE_TAG } from '@/lib/sitemap-store'
import { getSitemapDiscoveries, checkSitemapDetail } from '@/lib/tmdb'
import { sitemapPageCount } from '@/lib/sitemap-registry'

export const maxDuration = 180

export async function GET(request: Request) {
  if (!isCronAuthorized(request.headers.get('authorization'), process.env.CRON_SECRET)) {
    return new Response('Unauthorized', { status: 401 })
  }
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    return new Response('Production only', { status: 403 })
  }
  try {
    const result = await collectSitemap({
      read: readSitemapSnapshot, write: writeSitemapSnapshot,
      discover: getSitemapDiscoveries, check: checkSitemapDetail,
    })
    // Retry cache invalidation even after a duplicate invocation or a previous invalidation failure.
    revalidateTag(SITEMAP_CACHE_TAG, { expire: 0 })
    revalidatePath('/sitemap.xml')
    for (let page = 0; page < sitemapPageCount(result.registry); page++) revalidatePath(`/sitemaps/${page}.xml`)
    return Response.json({
      updated: result.updated, collectedAt: result.registry.collectedAt, checked: result.checked,
      total: result.registry.entries.length, active: result.registry.entries.filter((entry) => !entry.excludedAt).length,
    })
  } catch (error) {
    // Report actionable failures without including credentials from upstream requests.
    let reason = error instanceof Error ? error.message : 'Unknown error'
    for (const secret of [process.env.TMDB_API_KEY, process.env.NEXT_PUBLIC_API_KEY, process.env.SITEMAP_READ_WRITE_TOKEN, process.env.CRON_SECRET, process.env.VERCEL_OIDC_TOKEN]) {
      if (secret) reason = reason.replaceAll(secret, '[redacted]')
    }
    console.error('Daily sitemap collection failed; the stored registry was preserved.', {
      name: error instanceof Error ? error.name : 'UnknownError',
      reason: reason.replace(/https?:\/\/\S+/g, '[upstream URL]'),
    })
    return Response.json({ error: 'Sitemap collection failed' }, { status: 503 })
  }
}
