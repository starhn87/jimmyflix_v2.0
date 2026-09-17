import 'server-only'

import { locales } from '@/lib/i18n'
import { getImageUrl } from '@/lib/media'
import type { SitemapPath } from '@/lib/sitemap'
import { isSitemapDetailPath, type SitemapCheck } from '@/lib/sitemap-registry'
import type { PersonDetail, TmdbListResponse } from '@/types/tmdb'
import { tmdbFetch, sitemapFetchScope, TmdbNotFoundError } from '@/lib/tmdb/client'
import { getMovieSectionRequests, getTvSectionRequests } from '@/lib/tmdb/catalog'
import { getTrendingSectionRequests, getTrendingPersonList } from '@/lib/tmdb/trending'
import { getStreamingDiscovery } from '@/lib/tmdb/streaming'

// The daily collector needs fresh data; this request-local scope does not change page caches.
export const getSitemapDiscoveries = () => sitemapFetchScope.run(true, collectSitemapPaths)

export async function checkSitemapDetail(path: string): Promise<SitemapCheck['status']> {
  if (!isSitemapDetailPath(path)) return 'unknown'
  const [, kind, id] = path.split('/')
  const endpoint = `${kind === 'movies' ? 'movie' : kind === 'people' ? 'person' : 'tv'}/${id}`
  try {
    await sitemapFetchScope.run(true, () => tmdbFetch(endpoint, {}, { timeoutMs: 5000 }))
    return 'available'
  } catch (error) {
    return error instanceof TmdbNotFoundError ? 'missing' : 'unknown'
  }
}

async function collectSitemapPaths(): Promise<SitemapPath[]> {
  const paths = await Promise.all(locales.map(async (locale) => {
    const sections = [
      ...getMovieSectionRequests(locale), ...getTvSectionRequests(locale),
      ...getTrendingSectionRequests('day', locale), ...getTrendingSectionRequests('week', locale),
    ]
    const [catalog, people, dailyPeople, weeklyPeople, ...streaming] = await Promise.all([
      Promise.all(sections.map(({ request }) => request)),
      tmdbFetch<TmdbListResponse<PersonDetail & { adult?: boolean }>>(
        'person/popular', {}, { locale, revalidate: 3600, timeoutMs: 8000 },
      ),
      getTrendingPersonList('day', locale),
      getTrendingPersonList('week', locale),
      getStreamingDiscovery('movie', null, locale),
      getStreamingDiscovery('tv', null, locale),
    ])
    catalog.push(...streaming.map(({ section }) => section))
    // A failed refresh must preserve the previous sitemap in the ISR cache.
    if (catalog.some((section) => section.error)) throw new Error('Sitemap catalog is unavailable.')
    return [
      ...catalog.flatMap((section) => section.items.filter((item) => !item.adult).map((item) => ({
        path: `/${section.mediaType === 'movie' ? 'movies' : 'tv'}/${item.id}`,
        images: { [locale]: getImageUrl(item.poster_path, 'original') || undefined },
      }))),
      ...[...people.results, ...dailyPeople.results, ...weeklyPeople.results].filter((person) => !person.adult).map((person) => ({
        path: `/people/${person.id}`,
        images: { [locale]: getImageUrl(person.profile_path, 'original') || undefined },
      })),
    ]
  }))
  return paths.flat()
}
