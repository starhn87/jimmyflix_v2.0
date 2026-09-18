import type { Locale } from '@/lib/i18n'
import type { Region } from '@/lib/region'
import type { MediaType } from '@/types/tmdb'

export const STREAMING_CACHE_SECONDS = 1800

export const streamingProviderIds: Record<Region, Record<MediaType, number[]>> = {
  KR: {
    movie: [8, 337, 350, 1883, 356, 97, 119],
    tv: [8, 337, 350, 1883, 1881, 356, 97, 119],
  },
  US: {
    movie: [8, 337, 15, 9, 350, 2303, 1899, 386],
    tv: [8, 337, 15, 9, 350, 2303, 1899, 386],
  },
}

export function getStreamingUrl(locale: Locale, region: Region, mediaType: MediaType, providerId: number) {
  return `/api/streaming?locale=${locale}&region=${region}&kind=${mediaType}&provider=${providerId}`
}
