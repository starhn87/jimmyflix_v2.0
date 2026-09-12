import 'server-only'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import {
  CollectionDataPanel,
  CreditsDataPanel,
  ProductionDataPanel,
  RelatedTitlesDataSection,
  TvSeasonsDataPanel,
} from '@/components/detail-data-panels'
import { DetailView } from '@/components/detail-view'
import { DetailPanelSkeleton, MediaSectionSkeleton } from '@/components/loading-skeletons'
import { getDictionary } from '@/lib/dictionaries'
import { isLocale, type Locale } from '@/lib/i18n'
import { getMediaTitle } from '@/lib/media'
import { parsePositiveInteger } from '@/lib/params'
import {
  getCollection,
  getCredits,
  getMovieDetail,
  getRelatedTitles,
  getTvDetail,
  getTvSeasonDetail,
  getWatchProviders,
  TmdbNotFoundError,
} from '@/lib/tmdb'
import type { MediaDetail, MediaType } from '@/types/tmdb'

export interface MediaDetailRouteParams {
  locale: string
  id: string
}

interface MediaDetailPageProps {
  params: Promise<MediaDetailRouteParams>
  mediaType: MediaType
}

const loadDetail = (mediaType: MediaType, id: number, locale: Locale) => (
  mediaType === 'movie' ? getMovieDetail(id, locale) : getTvDetail(id, locale)
)

export async function getMediaDetailMetadata(
  params: Promise<MediaDetailRouteParams>,
  mediaType: MediaType,
): Promise<Metadata> {
  const { locale, id: rawId } = await params
  if (!isLocale(locale)) return {}

  const dictionary = getDictionary(locale)
  const id = parsePositiveInteger(rawId)
  const notFoundTitle = mediaType === 'movie'
    ? dictionary.detail.movieNotFound
    : dictionary.detail.tvNotFound
  if (!id) return { title: notFoundTitle }

  try {
    const detail = await loadDetail(mediaType, id, locale)
    return {
      title: getMediaTitle(detail, locale),
      description: detail.overview || (
        mediaType === 'movie'
          ? dictionary.detail.movieDescriptionFallback
          : dictionary.detail.tvDescriptionFallback
      ),
    }
  } catch {
    return {
      title: mediaType === 'movie'
        ? dictionary.detail.movieMetadataFallback
        : dictionary.detail.tvMetadataFallback,
    }
  }
}

export async function MediaDetailPage({ params, mediaType }: MediaDetailPageProps) {
  const { locale, id: rawId } = await params
  if (!isLocale(locale)) notFound()

  const id = parsePositiveInteger(rawId)
  if (!id) notFound()

  const dictionary = getDictionary(locale)
  const detailRequest = loadDetail(mediaType, id, locale)
  const creditsRequest = getCredits(mediaType, id, locale)
  const providersRequest = getWatchProviders(mediaType, id, locale)
  const relatedRequest = getRelatedTitles(mediaType, id, locale)
  // The panels consume these promises through separate Suspense boundaries.
  // Observe failures immediately in case the primary detail request returns 404.
  void Promise.allSettled([creditsRequest, providersRequest, relatedRequest])
  let detail: MediaDetail

  try {
    detail = await detailRequest
  } catch (error) {
    if (error instanceof TmdbNotFoundError) notFound()
    throw error
  }

  const collectionRequest = mediaType === 'movie' && detail.belongs_to_collection
    ? getCollection(detail.belongs_to_collection.id, locale)
    : undefined
  const regularSeasons = mediaType === 'tv'
    ? (detail.seasons || []).filter((season) => season.season_number > 0)
    : []
  const latestSeason = regularSeasons.at(-1)
  const latestSeasonRequest = latestSeason
    ? getTvSeasonDetail(id, latestSeason.season_number, locale)
    : undefined

  return (
    <DetailView
      detail={detail}
      mediaType={mediaType}
      locale={locale}
      creditsPanel={(
        <Suspense fallback={<DetailPanelSkeleton label={dictionary.detail.loadingCredits} />}>
          <CreditsDataPanel request={creditsRequest} locale={locale} />
        </Suspense>
      )}
      productionPanel={(
        <Suspense fallback={<DetailPanelSkeleton label={dictionary.detail.loadingProduction} />}>
          <ProductionDataPanel
            detail={detail}
            creditsRequest={creditsRequest}
            providersRequest={providersRequest}
            locale={locale}
          />
        </Suspense>
      )}
      collectionPanel={collectionRequest ? (
        <Suspense fallback={<DetailPanelSkeleton label={dictionary.detail.loadingCollection} />}>
          <CollectionDataPanel request={collectionRequest} locale={locale} />
        </Suspense>
      ) : undefined}
      seasonsPanel={mediaType === 'tv' && detail.seasons?.length ? (
        <Suspense fallback={<DetailPanelSkeleton label={dictionary.detail.loadingSeasons} />}>
          <TvSeasonsDataPanel
            seasons={detail.seasons}
            featuredEpisode={detail.next_episode_to_air || detail.last_episode_to_air}
            request={latestSeasonRequest}
            locale={locale}
          />
        </Suspense>
      ) : undefined}
      relatedSection={(
        <Suspense fallback={<MediaSectionSkeleton label={dictionary.detail.loadingRelated} />}>
          <RelatedTitlesDataSection
            request={relatedRequest}
            mediaType={mediaType}
            id={id}
            locale={locale}
          />
        </Suspense>
      )}
    />
  )
}
