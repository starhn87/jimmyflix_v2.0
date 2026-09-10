import type { MediaItem, MediaType } from '@/types/tmdb'
import { getLocalePath, type Locale } from '@/lib/i18n'
import type { ImageProps } from 'next/image'

type ImageSize =
  | 'w185'
  | 'w300'
  | 'w342'
  | 'w500'
  | 'w780'
  | 'w1280'
  | 'original'

export const getMediaTitle = (
  item: Pick<MediaItem, 'title' | 'name'>,
  locale: Locale = 'en',
) => item.title?.trim() || item.name?.trim() || (locale === 'ko' ? '제목 없음' : 'Untitled')

export const getMediaYear = (
  item: Pick<MediaItem, 'release_date' | 'first_air_date'>,
  locale: Locale = 'en',
) => {
  const date = item.release_date || item.first_air_date
  return date?.slice(0, 4) || (locale === 'ko' ? '연도 미상' : 'Year unknown')
}

export const getMediaType = (
  item: Pick<MediaItem, 'media_type' | 'title'>,
  fallback?: MediaType,
): MediaType => {
  if (item.media_type === 'movie' || item.media_type === 'tv') {
    return item.media_type
  }

  return fallback || (item.title ? 'movie' : 'tv')
}

export const getMediaHref = (item: MediaItem, fallback: MediaType | undefined, locale: Locale) => {
  const mediaType = getMediaType(item, fallback)
  const href = mediaType === 'movie' ? `/movies/${item.id}` : `/tvs/${item.id}`
  return getLocalePath(locale, href)
}

export const getImageUrl = (
  path: string | null | undefined,
  size: ImageSize = 'w500',
) => (path ? `https://image.tmdb.org/t/p/${size}${path}` : null)

const shimmerSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" preserveAspectRatio="none">
    <defs>
      <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="white" stop-opacity="0" />
        <stop offset="0.5" stop-color="white" stop-opacity="0.16" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </linearGradient>
    </defs>
    <rect x="-400" width="400" height="600" fill="url(#shimmer)">
      <animate attributeName="x" from="-400" to="800" dur="1.4s" repeatCount="indefinite" />
    </rect>
  </svg>
`

export const imageSkeletonPlaceholder =
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(shimmerSvg)}` as ImageProps['placeholder']

export const getPosterUrl = (path: string | null | undefined) =>
  getImageUrl(path, 'w500') || '/images/defaultPoster.png'

export const getProfileUrl = (path: string | null | undefined) =>
  getImageUrl(path, 'w500') || '/images/defaultPerson.png'

export const formatRating = (rating: number | undefined, locale: Locale = 'en') => {
  if (!Number.isFinite(rating) || Number(rating) <= 0) {
    return null
  }

  const value = Number(rating).toFixed(1)
  return {
    value,
    label: locale === 'ko' ? `평점 10점 만점에 ${value}점` : `Rating ${value} out of 10`,
  }
}
