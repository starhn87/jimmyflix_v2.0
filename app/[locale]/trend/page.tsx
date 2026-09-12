import type { Metadata } from 'next'
import { Suspense } from 'react'
import { MediaSectionSkeleton } from '@/components/loading-skeletons'
import { TrendHeader, TrendingRankingSection, TrendingPeopleSection, TrendingStreamingSection, TREND_STACK_CLASS_NAME } from '@/components/trend-content'
import { getDictionary } from '@/lib/dictionaries'
import { isLocale } from '@/lib/i18n'
import { getFirstSearchParam, parsePositiveInteger } from '@/lib/params'
import { getStreamingDiscovery, getTrendingPeople, getTrendingRankingRequests } from '@/lib/tmdb'
import type { TimeWindow } from '@/types/tmdb'
import { createPageMetadata } from '@/lib/seo'

interface TrendPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ window?: string | string[]; provider?: string | string[]; kind?: string | string[] }>
}

export async function generateMetadata({ params }: TrendPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dictionary = getDictionary(locale)
  return createPageMetadata({
    locale,
    path: '/trend',
    title: dictionary.trend.metadataTitle,
    description: dictionary.trend.metadataDescription,
  })
}

export default async function TrendPage({ params, searchParams }: TrendPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams])
  if (!isLocale(locale)) return null
  const dictionary = getDictionary(locale)
  const rawWindow = getFirstSearchParam(query.window)
  const window: TimeWindow = rawWindow === 'week' ? 'week' : 'day'
  const mediaType = getFirstSearchParam(query.kind) === 'tv' ? 'tv' : 'movie'
  const provider = parsePositiveInteger(query.provider)
  const sections = getTrendingRankingRequests(window, locale)
  const peopleRequest = getTrendingPeople(window, locale)
  const streamingRequest = getStreamingDiscovery(mediaType, provider, locale, 20)

  return (
    <main className="pb-20">
      <TrendHeader locale={locale} window={window} query={{ kind: mediaType, ...(provider ? { provider } : {}) }} />
      <div className={TREND_STACK_CLASS_NAME}>
        {sections.map((section, index) => (
          <Suspense
            key={`${window}-${section.id}`}
            fallback={<MediaSectionSkeleton label={locale === 'ko' ? `${section.title} 불러오는 중` : `Loading ${section.title}`} />}
          >
            <TrendingRankingSection request={section.request} locale={locale} prioritizeFirst={index === 0} />
          </Suspense>
        ))}
        <Suspense key={`people-${window}`} fallback={<MediaSectionSkeleton label={dictionary.trend.people} />}>
          <TrendingPeopleSection request={peopleRequest} locale={locale} window={window} />
        </Suspense>
        <Suspense key={`streaming-${mediaType}-${provider}`} fallback={<MediaSectionSkeleton label={dictionary.sections.loadingStreaming} withToolbar withMediaTypeFilter />}>
          <TrendingStreamingSection request={streamingRequest} locale={locale} window={window} mediaType={mediaType} />
        </Suspense>
      </div>
    </main>
  )
}
