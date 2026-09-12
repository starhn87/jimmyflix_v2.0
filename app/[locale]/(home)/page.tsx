import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AsyncMediaSection, CatalogHero } from '@/components/catalog-content'
import { HeroSkeleton, MediaSectionSkeleton } from '@/components/loading-skeletons'
import { RecentlyViewedSection } from '@/components/recently-viewed'
import { StreamingProviderSection } from '@/components/streaming-provider-section'
import { getDictionary } from '@/lib/dictionaries'
import { isLocale } from '@/lib/i18n'
import { getMovieSectionRequests, getStreamingDiscovery } from '@/lib/tmdb'

export const revalidate = 1800

interface MoviesPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ provider?: string | string[] }>
}

const parseProviderId = (value: string | string[] | undefined) => {
  const id = Number(Array.isArray(value) ? value[0] : value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

export async function generateMetadata({ params }: MoviesPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dictionary = getDictionary(locale)
  return {
    title: dictionary.movies.metadataTitle,
    description: dictionary.movies.metadataDescription,
  }
}

export default async function MoviesPage({ params, searchParams }: MoviesPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams])
  if (!isLocale(locale)) return null
  const dictionary = getDictionary(locale)
  const sections = getMovieSectionRequests(locale)
  const [leadSection, ...remainingSections] = sections
  const streamingRequest = getStreamingDiscovery(
    'movie',
    parseProviderId(query.provider),
    locale,
  )

  return (
    <main>
      <Suspense fallback={<HeroSkeleton label={dictionary.movies.loadingFeatured} />}>
        <CatalogHero
          requests={sections}
          mediaType="movie"
          eyebrow={dictionary.movies.featured}
          heading={dictionary.movies.heading}
          errorTitle={dictionary.movies.unavailable}
          locale={locale}
        />
      </Suspense>
      <div className="relative z-10 mt-6 space-y-10 pb-20 sm:-mt-8 sm:space-y-14">
        <Suspense
          fallback={<MediaSectionSkeleton label={locale === 'ko' ? `${leadSection.title} 불러오는 중` : `Loading ${leadSection.title}`} />}
        >
          <AsyncMediaSection request={leadSection.request} locale={locale} />
        </Suspense>
        <Suspense fallback={<MediaSectionSkeleton label={dictionary.sections.loadingStreaming} withToolbar />}>
          <StreamingProviderSection request={streamingRequest} locale={locale} basePath="/" />
        </Suspense>
        {remainingSections.map((section) => (
          <Suspense
            key={section.id}
            fallback={<MediaSectionSkeleton label={locale === 'ko' ? `${section.title} 불러오는 중` : `Loading ${section.title}`} />}
          >
            <AsyncMediaSection request={section.request} locale={locale} />
          </Suspense>
        ))}
        <RecentlyViewedSection
          locale={locale}
          title={dictionary.sections.recentlyViewed}
          description={dictionary.sections.recentlyViewedDescription}
          backwardLabel={dictionary.common.scrollBackward(dictionary.sections.recentlyViewed)}
          forwardLabel={dictionary.common.scrollForward(dictionary.sections.recentlyViewed)}
        />
      </div>
    </main>
  )
}
