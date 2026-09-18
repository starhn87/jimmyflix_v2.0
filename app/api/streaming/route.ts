import { isLocale } from '@/lib/i18n'
import { isRegion } from '@/lib/region'
import { STREAMING_CACHE_SECONDS, streamingProviderIds } from '@/lib/streaming'
import { getStreamingDiscovery } from '@/lib/tmdb/streaming'

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const locale = params.get('locale') ?? undefined
  const region = params.get('region')
  const kind = params.get('kind')
  const providerId = Number(params.get('provider'))
  const noStore = { 'Cache-Control': 'no-store' }

  if (!isLocale(locale) || !isRegion(region) || (kind !== 'movie' && kind !== 'tv')
    || !streamingProviderIds[region][kind].includes(providerId)) {
    return Response.json({ error: 'Invalid streaming selection.' }, { status: 400, headers: noStore })
  }

  // Every variation is in the URL; cookies never affect this publicly cached response.
  const { section } = await getStreamingDiscovery(kind, providerId, locale, undefined, region)
  if (section.error) {
    return Response.json({ error: 'Streaming titles are unavailable.' }, { status: 503, headers: noStore })
  }

  return Response.json(section, {
    headers: section.partial ? noStore : {
      'Cache-Control': `public, max-age=${STREAMING_CACHE_SECONDS}, stale-while-revalidate=3600`,
      'Vercel-CDN-Cache-Control': `public, s-maxage=${STREAMING_CACHE_SECONDS}, stale-while-revalidate=3600`,
    },
  })
}
