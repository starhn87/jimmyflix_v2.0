import type { Metadata } from 'next'
import { Suspense } from 'react'
import { MediaSection } from '@/components/media-section'
import { MediaSectionSkeleton } from '@/components/loading-skeletons'
import { TrendHeader, TrendingRankingSection, TrendingPeopleSection, TREND_STACK_CLASS_NAME } from '@/components/trend-content'
import { getDictionary } from '@/lib/dictionaries'
import { isLocale, type Locale } from '@/lib/i18n'
import { getFirstSearchParam } from '@/lib/params'
import { getTrendingRediscovery, getTrendingPeople, getTrendingRankingRequests } from '@/lib/tmdb'
import type { TimeWindow } from '@/types/tmdb'
import { createPageMetadata } from '@/lib/seo'

interface TrendPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ window?: string | string[] }>
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
  const sections = getTrendingRankingRequests(window, locale)
  const peopleRequest = getTrendingPeople(window, locale)
  const rediscoveryRequest = getTrendingRediscovery(window, locale)

  return (
    <main className="pb-20">
      <TrendHeader locale={locale} window={window} />
      <div className={TREND_STACK_CLASS_NAME}>
        {sections.map((section, index) => (
          <Suspense
            key={`${window}-${section.id}`}
            fallback={<MediaSectionSkeleton label={locale === 'ko' ? `${section.title} 불러오는 중` : `Loading ${section.title}`} title={section.title} description={dictionary.trend.rankingDescription(window)} itemCount={10} />}
          >
            <TrendingRankingSection request={section.request} locale={locale} prioritizeFirst={index === 0} />
          </Suspense>
        ))}
        <Suspense key={`people-${window}`} fallback={<MediaSectionSkeleton label={dictionary.trend.people} title={dictionary.trend.people} description={dictionary.trend.peopleDescription(window)} itemCount={10} />}>
          <TrendingPeopleSection request={peopleRequest} locale={locale} window={window} />
        </Suspense>
        <Suspense key={`rediscovery-${window}`} fallback={<MediaSectionSkeleton label={dictionary.trend.rediscovery} title={dictionary.trend.rediscovery} description={dictionary.trend.rediscoveryDescription(window)} itemCount={20} />}>
          <RediscoverySection request={rediscoveryRequest} locale={locale} />
        </Suspense>
      </div>
    </main>
  )
}

async function RediscoverySection({ request, locale }: {
  request: ReturnType<typeof getTrendingRediscovery>
  locale: Locale
}) {
  return <MediaSection section={await request} locale={locale} />
}
