import 'server-only'

import type { DiscoveryFilters } from '@/lib/discovery'
import type { Locale } from '@/lib/i18n'
import type { Region } from '@/lib/region'
import { getDiscoverList } from '@/lib/tmdb/lists'

export async function getDiscoveryResults(
  filters: DiscoveryFilters,
  locale: Locale,
  region: Region,
) {
  const sortBy = filters.sort === 'rated'
    ? 'vote_average.desc'
    : filters.sort === 'recent'
      ? filters.mediaType === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc'
      : 'popularity.desc'

  return getDiscoverList(filters.mediaType, {
    sort_by: sortBy,
    region,
    ...(filters.genre ? { with_genres: filters.genre } : {}),
    ...(filters.runtime ? { 'with_runtime.lte': filters.runtime } : {}),
    ...(filters.minimumRating ? { 'vote_average.gte': filters.minimumRating } : {}),
    'vote_count.gte': filters.sort === 'rated' ? 200 : 30,
    ...(filters.provider ? {
      watch_region: region,
      with_watch_providers: filters.provider,
      with_watch_monetization_types: 'flatrate',
    } : {}),
  }, locale)
}
