import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import {
  CollectionDataPanel,
  CreditsDataPanel,
  ProductionDataPanel,
  RelatedTitlesDataSection,
} from '@/components/detail-data-panels'
import { DetailView } from '@/components/detail-view'
import { DetailPanelSkeleton, MediaSectionSkeleton } from '@/components/loading-skeletons'
import {
  getCollection,
  getCredits,
  getMovieDetail,
  getRelatedTitles,
  getWatchProviders,
  TmdbNotFoundError,
} from '@/lib/tmdb'
import { getMediaTitle } from '@/lib/media'
import { getDictionary } from '@/lib/dictionaries'
import { isLocale } from '@/lib/i18n'

interface MovieDetailPageProps {
  params: Promise<{ locale: string; id: string }>
}

const parseId = (value: string) => {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

export async function generateMetadata({ params }: MovieDetailPageProps): Promise<Metadata> {
  const { locale, id: rawId } = await params
  if (!isLocale(locale)) return {}
  const dictionary = getDictionary(locale)
  const id = parseId(rawId)
  if (!id) return { title: dictionary.detail.movieNotFound }

  try {
    const detail = await getMovieDetail(id, locale)
    return {
      title: getMediaTitle(detail, locale),
      description: detail.overview || dictionary.detail.movieDescriptionFallback,
    }
  } catch {
    return { title: dictionary.detail.movieMetadataFallback }
  }
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { locale, id: rawId } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = getDictionary(locale)
  const id = parseId(rawId)
  if (!id) notFound()

  let detail
  try {
    detail = await getMovieDetail(id, locale)
  } catch (error) {
    if (error instanceof TmdbNotFoundError) notFound()
    throw error
  }

  const creditsRequest = getCredits('movie', id, locale)
  const providersRequest = getWatchProviders('movie', id, locale)
  const relatedRequest = getRelatedTitles('movie', id, locale)
  const collectionRequest = detail.belongs_to_collection
    ? getCollection(detail.belongs_to_collection.id, locale)
    : undefined

  return (
    <DetailView
      detail={detail}
      mediaType="movie"
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
      relatedSection={(
        <Suspense fallback={<MediaSectionSkeleton label={dictionary.detail.loadingRelated} />}>
          <RelatedTitlesDataSection
            request={relatedRequest}
            mediaType="movie"
            id={id}
            locale={locale}
          />
        </Suspense>
      )}
    />
  )
}
