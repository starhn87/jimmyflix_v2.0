import 'server-only'

import {
  CollectionPanel,
  CreditsPanel,
  ProductionPanel,
  SeasonsPanel,
} from '@/components/detail-panels'
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

export async function ProductionDataPanel({
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
  const [credits, providers] = await Promise.allSettled([
    creditsRequest,
    providersRequest,
  ])

  return (
    <ProductionPanel
      detail={detail}
      crew={credits.status === 'fulfilled' ? credits.value.crew : []}
      providers={providers.status === 'fulfilled' ? providers.value : null}
      locale={locale}
    />
  )
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
