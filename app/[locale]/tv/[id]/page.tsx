import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import {
  CreditsDataPanel,
  ProductionDataPanel,
  RelatedTitlesDataSection,
} from '@/components/detail-data-panels'
import { DetailView } from '@/components/detail-view'
import { DetailPanelSkeleton, MediaSectionSkeleton } from '@/components/loading-skeletons'
import { getMediaTitle } from '@/lib/media'
import {
  getCredits,
  getRelatedTitles,
  getTvDetail,
  getWatchProviders,
  TmdbNotFoundError,
} from '@/lib/tmdb'
import { getDictionary } from '@/lib/dictionaries'
import { isLocale } from '@/lib/i18n'

interface TvDetailPageProps {
  params: Promise<{ locale: string; id: string }>
}

const parseId = (value: string) => {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

export async function generateMetadata({ params }: TvDetailPageProps): Promise<Metadata> {
  const { locale, id: rawId } = await params
  if (!isLocale(locale)) return {}
  const dictionary = getDictionary(locale)
  const id = parseId(rawId)
  if (!id) return { title: dictionary.detail.tvNotFound }

  try {
    const detail = await getTvDetail(id, locale)
    return {
      title: getMediaTitle(detail, locale),
      description: detail.overview || dictionary.detail.tvDescriptionFallback,
    }
  } catch {
    return { title: dictionary.detail.tvMetadataFallback }
  }
}

export default async function TvDetailPage({ params }: TvDetailPageProps) {
  const { locale, id: rawId } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = getDictionary(locale)
  const id = parseId(rawId)
  if (!id) notFound()

  let detail
  try {
    detail = await getTvDetail(id, locale)
  } catch (error) {
    if (error instanceof TmdbNotFoundError) notFound()
    throw error
  }

  const creditsRequest = getCredits('tv', id, locale)
  const providersRequest = getWatchProviders('tv', id, locale)
  const relatedRequest = getRelatedTitles('tv', id, locale)

  return (
    <DetailView
      detail={detail}
      mediaType="tv"
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
      relatedSection={(
        <Suspense fallback={<MediaSectionSkeleton label={dictionary.detail.loadingRelated} />}>
          <RelatedTitlesDataSection
            request={relatedRequest}
            mediaType="tv"
            id={id}
            locale={locale}
          />
        </Suspense>
      )}
    />
  )
}
