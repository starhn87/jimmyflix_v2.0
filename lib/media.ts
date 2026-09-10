import type { MediaItem, MediaType } from '@/types/tmdb'

type ImageSize =
  | 'w185'
  | 'w300'
  | 'w342'
  | 'w500'
  | 'w780'
  | 'w1280'
  | 'original'

export const getMediaTitle = (item: Pick<MediaItem, 'title' | 'name'>) =>
  item.title?.trim() || item.name?.trim() || 'Untitled'

export const getMediaYear = (
  item: Pick<MediaItem, 'release_date' | 'first_air_date'>,
) => {
  const date = item.release_date || item.first_air_date
  return date?.slice(0, 4) || 'Year unknown'
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

export const getMediaHref = (item: MediaItem, fallback?: MediaType) => {
  const mediaType = getMediaType(item, fallback)
  return mediaType === 'movie' ? `/movies/${item.id}` : `/tvs/${item.id}`
}

export const getImageUrl = (
  path: string | null | undefined,
  size: ImageSize = 'w500',
) => (path ? `https://image.tmdb.org/t/p/${size}${path}` : null)

export const getPosterUrl = (path: string | null | undefined) =>
  getImageUrl(path, 'w500') || '/images/defaultPoster.png'

export const getProfileUrl = (path: string | null | undefined) =>
  getImageUrl(path, 'w342') || '/images/defaultPerson.png'

export const formatRating = (rating: number | undefined) => {
  if (!Number.isFinite(rating) || Number(rating) <= 0) {
    return { value: 'NR', label: 'Not rated' }
  }

  const value = Number(rating).toFixed(1)
  return { value, label: `Rating ${value} out of 10` }
}
