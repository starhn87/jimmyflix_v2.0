import 'server-only'

import { cache } from 'react'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import type { MediaItem, MediaType, TimeWindow, TmdbListResponse, TrendingPerson, TrendingPeopleData, PersonCredits } from '@/types/tmdb'
import { selectRankedTitles, selectRediscoveredTitles, loadTrendingPeople } from '@/lib/trending'
import { tmdbFetch, CACHE_SECONDS } from '@/lib/tmdb/client'
import { CATALOG_ITEM_LIMIT } from '@/lib/tmdb/lists'
import { createSectionRequests } from '@/lib/tmdb/sections'

const getTrendingPage = cache((mediaType: MediaType, window: TimeWindow, locale: Locale, page: number) =>
  tmdbFetch<TmdbListResponse<MediaItem>>(`trending/${mediaType}/${window}`, { page }, {
    locale, revalidate: CACHE_SECONDS.trending, timeoutMs: 8000,
  }),
)

const getTrendingTitles = cache(async (mediaType: MediaType, window: TimeWindow, locale: Locale) => {
  const pages = await Promise.allSettled([1, 2].map((page) => getTrendingPage(mediaType, window, locale, page)))
  if (pages[0].status === 'rejected') throw pages[0].reason
  return { items: selectRankedTitles(pages.flatMap((page) => page.status === 'fulfilled' ? page.value.results : []), mediaType, CATALOG_ITEM_LIMIT), partial: pages.some((page) => page.status === 'rejected') }
})

export const getTrendingSectionRequests = (window: TimeWindow, locale: Locale) => {
  const dictionary = getDictionary(locale)

  return createSectionRequests([
    {
      id: `trending-movies-${window}`,
      title: dictionary.sections.trendingMovies,
      description: dictionary.sections.trendingMoviesDescription(window),
      mediaType: 'movie',
      load: () => getTrendingTitles('movie', window, locale),
    },
    {
      id: `trending-tv-${window}`,
      title: dictionary.sections.trendingShows,
      description: dictionary.sections.trendingShowsDescription(window),
      mediaType: 'tv',
      load: () => getTrendingTitles('tv', window, locale),
    },
  ])
}

export const getTrendingRankingRequests = (window: TimeWindow, locale: Locale) => {
  const dictionary = getDictionary(locale).trend
  return createSectionRequests((['movie', 'tv'] as const).map((mediaType) => ({
    id: `top-${mediaType}-${window}`,
    title: mediaType === 'movie' ? dictionary.topMovies : dictionary.topShows,
    description: dictionary.rankingDescription(window),
    mediaType,
    // Top 10 can stream as soon as page 1 arrives; rediscovery's page 2 must not delay LCP.
    load: async () => ({ items: selectRankedTitles((await getTrendingPage(mediaType, window, locale, 1)).results, mediaType), partial: false }),
  })))
}

export const getTrendingRediscovery = (window: TimeWindow, locale: Locale) => {
  const dictionary = getDictionary(locale).trend
  return createSectionRequests([{
    id: `rediscovery-${window}`,
    title: dictionary.rediscovery,
    description: dictionary.rediscoveryDescription(window),
    mediaType: 'movie',
    load: async () => {
      const [movies, shows] = await Promise.all([
        getTrendingTitles('movie', window, locale), getTrendingTitles('tv', window, locale),
      ])
      return { items: selectRediscoveredTitles(movies.items, shows.items), partial: movies.partial || shows.partial }
    },
  }])[0].request
}

export const getTrendingPersonList = cache((window: TimeWindow, locale: Locale) =>
  tmdbFetch<TmdbListResponse<TrendingPerson>>(
    `trending/person/${window}`, {}, { locale, revalidate: CACHE_SECONDS.trending, timeoutMs: 8000 },
  ),
)

export const getTrendingPeople = async (window: TimeWindow, locale: Locale): Promise<TrendingPeopleData> => {
  try {
    const response = await getTrendingPersonList(window, locale)
    const seen = new Set<number>()
    const candidates = response.results.filter((person) => {
      if (person.adult || seen.has(person.id)) return false
      seen.add(person.id)
      return true
    })
    return await loadTrendingPeople(candidates, (id) => tmdbFetch<PersonCredits>(
      `person/${id}/combined_credits`, {}, { locale, revalidate: CACHE_SECONDS.reference, timeoutMs: 5000 },
    ))
  } catch {
    return { people: [], error: true }
  }
}
