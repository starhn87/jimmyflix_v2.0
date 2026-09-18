import 'server-only'

import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import { getDefaultRegion, type Region } from '@/lib/region'
import type { MediaSectionData, MediaType, StreamingDiscoveryData, WatchProvider, WatchProviderListResponse } from '@/types/tmdb'
import { tmdbFetch, CACHE_SECONDS } from '@/lib/tmdb/client'
import { getDiscoverList, CATALOG_ITEM_LIMIT } from '@/lib/tmdb/lists'

const preferredProviderIds: Record<Region, Record<MediaType, number[]>> = {
  KR: {
    movie: [8, 337, 350, 1883, 356, 97, 119],
    tv: [8, 337, 350, 1883, 1881, 356, 97, 119],
  },
  US: {
    movie: [8, 337, 15, 9, 350, 2303, 1899, 386],
    tv: [8, 337, 15, 9, 350, 2303, 1899, 386],
  },
}

const providerFallbacks: Record<number, Pick<WatchProvider, 'provider_id' | 'provider_name' | 'logo_path' | 'display_priority'>> = {
  8: { provider_id: 8, provider_name: 'Netflix', logo_path: null, display_priority: 0 },
  9: { provider_id: 9, provider_name: 'Prime Video', logo_path: null, display_priority: 0 },
  15: { provider_id: 15, provider_name: 'Hulu', logo_path: null, display_priority: 0 },
  97: { provider_id: 97, provider_name: 'Watcha', logo_path: null, display_priority: 0 },
  119: { provider_id: 119, provider_name: 'Prime Video', logo_path: null, display_priority: 0 },
  337: { provider_id: 337, provider_name: 'Disney+', logo_path: null, display_priority: 0 },
  350: { provider_id: 350, provider_name: 'Apple TV', logo_path: null, display_priority: 0 },
  356: { provider_id: 356, provider_name: 'Wavve', logo_path: null, display_priority: 0 },
  386: { provider_id: 386, provider_name: 'Peacock', logo_path: null, display_priority: 0 },
  1881: { provider_id: 1881, provider_name: 'Coupang Play', logo_path: null, display_priority: 0 },
  1883: { provider_id: 1883, provider_name: 'TVING', logo_path: null, display_priority: 0 },
  1899: { provider_id: 1899, provider_name: 'HBO Max', logo_path: null, display_priority: 0 },
  2303: { provider_id: 2303, provider_name: 'Paramount+', logo_path: null, display_priority: 0 },
}

// Subscription tiers share one selector; third-party channel add-ons stay separate.
const groupedProviderIds: Record<number, number[]> = {
  386: [386, 387],
  2303: [2303, 2616],
}

const getPreferredProviders = async (mediaType: MediaType, locale: Locale, region: Region) => {
  const ids = preferredProviderIds[region][mediaType]
  let availableProviders: WatchProvider[] = []

  try {
    const response = await tmdbFetch<WatchProviderListResponse>(
      `watch/providers/${mediaType}`,
      { watch_region: region },
      { locale, revalidate: CACHE_SECONDS.reference },
    )
    availableProviders = response.results
  } catch {
    // Keep the selector usable if provider metadata is temporarily unavailable.
  }

  return ids.map((id) => {
    const group = groupedProviderIds[id]
    const metadata = availableProviders.find((provider) => provider.provider_id === id)
      || availableProviders.find((provider) => group?.includes(provider.provider_id))
      || providerFallbacks[id]
    return {
      ...metadata,
      provider_id: id,
      provider_name: group ? providerFallbacks[id].provider_name : metadata.provider_name,
    }
  })
}

export const getStreamingDiscovery = async (
  mediaType: MediaType,
  requestedProviderId: number | null,
  locale: Locale,
  limit = CATALOG_ITEM_LIMIT,
  region: Region = getDefaultRegion(locale),
): Promise<StreamingDiscoveryData> => {
  const dictionary = getDictionary(locale).sections
  const preferredIds = preferredProviderIds[region][mediaType]
  const selectedProviderId = requestedProviderId && preferredIds.includes(requestedProviderId)
    ? requestedProviderId
    : preferredIds[0]
  const providersRequest = getPreferredProviders(mediaType, locale, region)
  const titlesRequest = getDiscoverList(mediaType, {
    sort_by: 'popularity.desc',
    'vote_count.gte': mediaType === 'movie' ? 50 : 25,
    watch_region: region,
    with_watch_providers: groupedProviderIds[selectedProviderId]?.join('|') || selectedProviderId,
    with_watch_monetization_types: 'flatrate',
  }, locale, limit)
  const [providersResult, titlesResult] = await Promise.allSettled([
    providersRequest,
    titlesRequest,
  ])
  const providers = providersResult.status === 'fulfilled'
    ? providersResult.value
    : preferredIds.map((id) => providerFallbacks[id]).filter(Boolean)
  const selected = providers.find((provider) => provider.provider_id === selectedProviderId) || providers[0]
  const mediaLabel = mediaType === 'movie'
    ? dictionary.streamingMovies
    : dictionary.streamingShows
  const section: MediaSectionData = {
    id: `streaming-${mediaType}`,
    title: mediaLabel(selected.provider_name),
    description: '',
    mediaType,
    items: titlesResult.status === 'fulfilled' ? titlesResult.value.items : [],
    partial: titlesResult.status === 'fulfilled' && titlesResult.value.partial,
    error: titlesResult.status === 'rejected',
  }

  return {
    section,
    selectedProviderId,
    providers: providers.map((provider) => ({
      ...provider,
      selected: provider.provider_id === selectedProviderId,
    })),
  }
}
