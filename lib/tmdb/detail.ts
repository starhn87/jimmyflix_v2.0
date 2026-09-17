import 'server-only'

import { cache } from 'react'
import type { Locale } from '@/lib/i18n'
import type { CollectionDetail, MediaCredits, MediaDetail, MediaType, PersonDetail, SeasonDetail, WatchProviderRegion, WatchProviderResponse, Video } from '@/types/tmdb'
import { tmdbFetch, REQUEST_TIMEOUT_MS } from '@/lib/tmdb/client'
import { getList, CATALOG_ITEM_LIMIT } from '@/lib/tmdb/lists'

const getMediaDetail = (mediaType: MediaType, id: number, locale: Locale) =>
  tmdbFetch<MediaDetail>(`${mediaType}/${id}`, {
    append_to_response: 'videos,images,keywords',
    include_image_language: locale === 'ko' ? 'ko,en,null' : 'en,null',
  }, { locale })

// Supplemental videos never gate the title, metadata or poster.
export const getEnglishVideos = cache((mediaType: MediaType, id: number) =>
  tmdbFetch<{ results: Video[] }>(`${mediaType}/${id}/videos`, {}, {
    locale: 'en', timeoutMs: REQUEST_TIMEOUT_MS.supplemental,
  }).then(({ results }) => results),
)

export const getMovieDetail = cache((id: number, locale: Locale) =>
  getMediaDetail('movie', id, locale),
)

export const getTvDetail = cache((id: number, locale: Locale) =>
  getMediaDetail('tv', id, locale),
)

export const getTvSeasonDetail = cache((
  id: number,
  seasonNumber: number,
  locale: Locale,
) => tmdbFetch<SeasonDetail>(`tv/${id}/season/${seasonNumber}`, {}, { locale }))

export const getCredits = cache(async (mediaType: MediaType, id: number, locale: Locale) => {
  return tmdbFetch<MediaCredits>(
    `${mediaType}/${id}/credits`,
    {},
    { locale },
  )
})

export const getCollection = cache(async (id: number, locale: Locale) => {
  const response = await tmdbFetch<CollectionDetail>(`collection/${id}`, {}, { locale })
  return response.parts
})

export const getRelatedTitles = cache(async (
  mediaType: MediaType,
  id: number,
  locale: Locale,
) => {
  const requests = await Promise.allSettled([
    getList(`${mediaType}/${id}/recommendations`, locale),
    getList(`${mediaType}/${id}/similar`, locale),
  ])
  if (requests[0].status === 'rejected' && requests[1].status === 'rejected') throw requests[0].reason
  const seen = new Set<number>([id])

  const items = requests.flatMap((result) => result.status === 'fulfilled' ? result.value.items : [])
    .filter((item) => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
    .slice(0, CATALOG_ITEM_LIMIT)
  return { items, partial: requests.some((result) => result.status === 'rejected' || result.value.partial) }
})

export const getWatchProviders = cache(async (
  mediaType: MediaType,
  id: number,
  locale: Locale,
): Promise<WatchProviderRegion | null> => {
  const response = await tmdbFetch<WatchProviderResponse>(
    `${mediaType}/${id}/watch/providers`,
    {},
    { locale },
  )
  const region = locale === 'ko' ? 'KR' : 'US'
  return response.results[region] || null
})

export const getPersonDetail = cache((id: number, locale: Locale) =>
  tmdbFetch<PersonDetail>(
    `person/${id}`,
    { append_to_response: 'combined_credits' },
    { locale },
  ),
)
