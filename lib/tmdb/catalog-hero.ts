import 'server-only'

import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { getLocalizedHeroCandidates } from '@/lib/hero-selection'
import type { Locale } from '@/lib/i18n'
import { getDefaultRegion, type Region } from '@/lib/region'
import type { MediaImages, MediaItem, MediaType, TmdbImage, TmdbListResponse } from '@/types/tmdb'
import { CACHE_SECONDS, REQUEST_TIMEOUT_MS, tmdbFetch } from '@/lib/tmdb/client'

const ULTRA_WIDE_BACKDROP_WIDTH = 2560

const isLandscapeBackdrop = (image: TmdbImage) => (
  Boolean(image.file_path?.trim())
  && image.width > image.height
  && image.width > 0
  && image.height > 0
)

const selectCatalogHeroBackdrop = (
  currentPath: string | null | undefined,
  backdrops: TmdbImage[],
) => {
  const candidates = backdrops.filter(isLandscapeBackdrop)
  const current = candidates.find(({ file_path }) => file_path === currentPath)
  if (current && current.width >= ULTRA_WIDE_BACKDROP_WIDTH) return current.file_path

  const highResolution = candidates
    .filter(({ width }) => width >= ULTRA_WIDE_BACKDROP_WIDTH)
    .sort((left, right) => (
      right.width - left.width
      || right.height - left.height
      || right.vote_average - left.vote_average
    ))[0]

  return highResolution?.file_path || currentPath || null
}

const resolveCatalogHeroBackdrop = cache(async (item: MediaItem, mediaType: MediaType, locale: Locale) => {
  try {
    const images = await tmdbFetch<Pick<MediaImages, 'backdrops'>>(
      `${mediaType}/${item.id}/images`,
      { include_image_language: locale === 'ko' ? 'ko,en,null' : 'en,null' },
      { locale, revalidate: CACHE_SECONDS.reference, timeoutMs: REQUEST_TIMEOUT_MS.heroArtwork },
    )
    const backdropPath = selectCatalogHeroBackdrop(
      item.backdrop_path,
      Array.isArray(images.backdrops) ? images.backdrops : [],
    )
    return backdropPath === item.backdrop_path ? item : { ...item, backdrop_path: backdropPath }
  } catch {
    return item
  }
})

const getCachedCatalogFeaturedItem = unstable_cache(async (
  mediaType: MediaType,
  locale: Locale,
  region: Region,
  rotationDay: number,
) => {
  // Share the first catalog fetch; the hero does not need to wait for page two.
  const response = await tmdbFetch<TmdbListResponse<MediaItem>>(
    mediaType === 'movie' ? 'movie/now_playing' : 'tv/on_the_air',
    { ...(mediaType === 'movie' ? { region } : {}), page: 1 },
    { locale },
  )
  const candidates = getLocalizedHeroCandidates(response.results, locale)
  const featured = candidates.length > 0 ? candidates[rotationDay % candidates.length] : null
  return featured ? await resolveCatalogHeroBackdrop(featured, mediaType, locale) : null
}, ['catalog-featured-v2'], { revalidate: CACHE_SECONDS.catalog })

export const getCatalogFeaturedItem = cache(async (
  mediaType: MediaType,
  locale: Locale,
  region: Region = getDefaultRegion(locale),
) => {
  try {
    const rotationDay = Math.floor(Date.now() / 86_400_000)
    return await getCachedCatalogFeaturedItem(mediaType, locale, region, rotationDay)
  } catch {
    return null
  }
})
