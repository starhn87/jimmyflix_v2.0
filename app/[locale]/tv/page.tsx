import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AsyncMediaSection, CatalogHero } from '@/components/catalog-content'
import { HeroSkeleton, MediaSectionSkeleton } from '@/components/loading-skeletons'
import { StreamingProviderSection } from '@/components/streaming-provider-section'
import { getDictionary } from '@/lib/dictionaries'
import { isLocale } from '@/lib/i18n'
import { getStreamingDiscovery, getTvSectionRequests } from '@/lib/tmdb'

export const revalidate = 1800

interface TvPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ provider?: string | string[] }>
}

const parseProviderId = (value: string | string[] | undefined) => {
  const id = Number(Array.isArray(value) ? value[0] : value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

export async function generateMetadata({ params }: TvPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dictionary = getDictionary(locale)
  return {
    title: dictionary.tv.metadataTitle,
    description: dictionary.tv.metadataDescription,
  }
}

export default async function TvPage({ params, searchParams }: TvPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams])
  if (!isLocale(locale)) return null
  const dictionary = getDictionary(locale)
  const sections = getTvSectionRequests(locale)
  const [leadSection, ...remainingSections] = sections
  const streamingRequest = getStreamingDiscovery(
    'tv',
    parseProviderId(query.provider),
    locale,
  )

  return (
    <main>
      <Suspense fallback={<HeroSkeleton label={dictionary.tv.loadingFeatured} />}>
        <CatalogHero
          requests={sections}
          mediaType="tv"
          eyebrow={dictionary.tv.featured}
          heading={dictionary.tv.heading}
          errorTitle={dictionary.tv.unavailable}
          locale={locale}
        />
      </Suspense>
      <div className="relative z-10 mt-6 space-y-10 pb-20 sm:-mt-8 lg:space-y-16">
        <Suspense
          fallback={<MediaSectionSkeleton label={locale === 'ko' ? `${leadSection.title} 불러오는 중` : `Loading ${leadSection.title}`} />}
        >
          <AsyncMediaSection request={leadSection.request} locale={locale} />
        </Suspense>
        <Suspense fallback={<MediaSectionSkeleton label={dictionary.sections.loadingStreaming} withToolbar />}>
          <StreamingProviderSection request={streamingRequest} locale={locale} basePath="/tv" />
        </Suspense>
        {remainingSections.map((section) => (
          <Suspense
            key={section.id}
            fallback={<MediaSectionSkeleton label={locale === 'ko' ? `${section.title} 불러오는 중` : `Loading ${section.title}`} />}
          >
            <AsyncMediaSection request={section.request} locale={locale} />
          </Suspense>
        ))}
      </div>
    </main>
  )
}
