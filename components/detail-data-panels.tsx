import 'server-only'

import { Suspense } from 'react'
import {
  CollectionPanel,
  CreditsPanel,
  CrewPanel,
  ProductionEmptyPanel,
  ProductionPanel,
  SeasonsPanel,
  WatchProvidersPanel,
} from '@/components/detail-panels'
import { PeopleSectionSkeleton, WatchProvidersSkeleton } from '@/components/loading-skeletons'
import { MediaSection } from '@/components/media-section'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import type {
  MediaCredits,
  MediaDetail,
  MediaItem,
  MediaType,
  Episode,
  Season,
  SeasonDetail,
  WatchProviderRegion,
} from '@/types/tmdb'

export async function CreditsDataPanel({ request, locale }: {
  request: Promise<MediaCredits>
  locale: Locale
}) {
  let cast: MediaCredits['cast'] = []
  let error = false

  try {
    cast = (await request).cast
  } catch {
    error = true
  }

  return <CreditsPanel cast={cast} error={error} locale={locale} />
}

export function ProductionDataPanel({
  detail,
  creditsRequest,
  providersRequest,
  locale,
}: {
  detail: MediaDetail
  creditsRequest: Promise<MediaCredits>
  providersRequest: Promise<WatchProviderRegion | null>
  locale: Locale
}) {
  const dictionary = getDictionary(locale)
  return (
    <ProductionPanel
      detail={detail}
      crewPanel={(
        <Suspense fallback={<PeopleSectionSkeleton label={dictionary.detail.loadingProduction} title={dictionary.detail.keyCrew} />}>
          <CrewDataPanel request={creditsRequest} locale={locale} />
        </Suspense>
      )}
      providersPanel={(
        <Suspense fallback={<WatchProvidersSkeleton label={dictionary.detail.loadingProduction} title={dictionary.detail.streamingAvailability} />}>
          <WatchProvidersDataPanel request={providersRequest} locale={locale} />
        </Suspense>
      )}
      emptyPanel={!detail.production_companies?.length && !detail.production_countries?.length ? (
        <Suspense fallback={null}>
          <EmptyProductionDataPanel creditsRequest={creditsRequest} providersRequest={providersRequest} locale={locale} />
        </Suspense>
      ) : null}
      locale={locale}
    />
  )
}

async function EmptyProductionDataPanel({ creditsRequest, providersRequest, locale }: {
  creditsRequest: Promise<MediaCredits>
  providersRequest: Promise<WatchProviderRegion | null>
  locale: Locale
}) {
  const [credits, providers] = await Promise.allSettled([creditsRequest, providersRequest])
  const hasCrew = credits.status === 'fulfilled' && credits.value.crew.length > 0
  const region = providers.status === 'fulfilled' ? providers.value : null
  const hasProviders = region && [region.flatrate, region.free, region.ads, region.rent, region.buy].some((items) => items?.length)
  return hasCrew || hasProviders ? null : <ProductionEmptyPanel locale={locale} />
}

async function CrewDataPanel({ request, locale }: { request: Promise<MediaCredits>; locale: Locale }) {
  let crew: MediaCredits['crew'] = []
  try {
    crew = (await request).crew
  } catch {
    return null
  }
  return <CrewPanel crew={crew} locale={locale} />
}

async function WatchProvidersDataPanel({ request, locale }: { request: Promise<WatchProviderRegion | null>; locale: Locale }) {
  let providers: WatchProviderRegion | null = null
  try {
    providers = await request
  } catch {
    return null
  }
  return <WatchProvidersPanel providers={providers} locale={locale} />
}

export async function CollectionDataPanel({ request, locale }: {
  request: Promise<MediaItem[]>
  locale: Locale
}) {
  let items: MediaItem[] = []
  let error = false

  try {
    items = await request
  } catch {
    error = true
  }

  return <CollectionPanel items={items} error={error} locale={locale} />
}

export async function TvSeasonsDataPanel({
  seasons,
  featuredEpisode,
  request,
  locale,
}: {
  seasons: Season[]
  featuredEpisode?: Episode | null
  request?: Promise<SeasonDetail>
  locale: Locale
}) {
  let latestSeason: SeasonDetail | null = null

  if (request) {
    try {
      latestSeason = await request
    } catch {
      // The season overview remains useful when episode details cannot be loaded.
    }
  }

  return (
    <SeasonsPanel
      seasons={seasons}
      latestSeason={latestSeason}
      featuredEpisode={featuredEpisode}
      locale={locale}
    />
  )
}

export async function RelatedTitlesDataSection({
  request,
  mediaType,
  id,
  locale,
}: {
  request: Promise<MediaItem[]>
  mediaType: MediaType
  id: number
  locale: Locale
}) {
  const dictionary = getDictionary(locale)
  let items: MediaItem[] = []
  let error = false

  try {
    items = await request
  } catch {
    error = true
  }

  return (
    <MediaSection
      locale={locale}
      section={{
        id: `related-${mediaType}-${id}`,
        title: dictionary.detail.moreLikeThis,
        description: dictionary.detail.moreLikeThisDescription,
        mediaType,
        items,
        error,
      }}
    />
  )
}
