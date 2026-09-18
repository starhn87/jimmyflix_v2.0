import 'server-only'

import { tmdbFetch, type QueryValue, type TmdbFetchOptions } from '@/lib/tmdb/client'
import type { Locale } from '@/lib/i18n'
import { getDefaultRegion, type Region } from '@/lib/region'
import type { MediaItem, MediaType, TmdbListResponse } from '@/types/tmdb'
export const CATALOG_ITEM_LIMIT = 40
export interface MediaListResult { items: MediaItem[]; partial: boolean }

export const getPagedMediaItems = async (
  path: string,
  query: Record<string, QueryValue>,
  options: TmdbFetchOptions,
  limit = CATALOG_ITEM_LIMIT,
) => {
  const pages = await Promise.allSettled(
    Array.from({ length: Math.ceil(limit / 20) }, (_, index) => tmdbFetch<TmdbListResponse<MediaItem>>(
      path,
      { ...query, page: index + 1 },
      options,
    )),
  )

  if (pages[0].status === 'rejected') throw pages[0].reason

  const seen = new Set<number>()
  const items = pages
    .flatMap((page) => page.status === 'fulfilled' ? page.value.results : [])
    .filter((item) => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
    .slice(0, limit)
  return { items, partial: pages.some((page) => page.status === 'rejected') }
}

export const getList = (path: string, locale: Locale, revalidate?: number) =>
  getPagedMediaItems(path, {}, { revalidate, locale })

export const getRegionalMovieList = (
  path: string,
  locale: Locale,
  region: Region = getDefaultRegion(locale),
) =>
  getPagedMediaItems(
    path,
    { region },
    { locale },
  )
export const getDiscoverList = async (
  mediaType: MediaType,
  query: Record<string, QueryValue>,
  locale: Locale,
  limit = CATALOG_ITEM_LIMIT,
) => {
  return getPagedMediaItems(
    `discover/${mediaType}`,
    { include_adult: false, ...query },
    { locale },
    limit,
  )
}
