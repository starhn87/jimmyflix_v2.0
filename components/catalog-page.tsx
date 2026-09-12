import 'server-only'

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogHero, AsyncMediaSection } from '@/components/catalog-content'
import { CATALOG_RAIL_STACK_CLASS_NAME } from '@/components/media-rail-styles'
import { HeroSkeleton, MediaSectionSkeleton } from '@/components/loading-skeletons'
import { RecentlyViewedSection } from '@/components/recently-viewed'
import { StreamingProviderSection } from '@/components/streaming-provider-section'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import {
  getMovieSectionRequests,
  getStreamingDiscovery,
  getTvSectionRequests,
} from '@/lib/tmdb'
import type { MediaType } from '@/types/tmdb'

interface CatalogPageProps {
  locale: Locale
  mediaType: MediaType
  requestedProviderId: number | null
}

const getSectionLoadingLabel = (title: string, locale: Locale) => (
  locale === 'ko' ? `${title} 불러오는 중` : `Loading ${title}`
)

export function getCatalogMetadata(locale: Locale, mediaType: MediaType): Metadata {
  const dictionary = getDictionary(locale)
  const catalog = mediaType === 'movie' ? dictionary.movies : dictionary.tv

  return {
    title: catalog.metadataTitle,
    description: catalog.metadataDescription,
  }
}

export function CatalogPage({ locale, mediaType, requestedProviderId }: CatalogPageProps) {
  const dictionary = getDictionary(locale)
  const catalog = mediaType === 'movie' ? dictionary.movies : dictionary.tv
  const sections = mediaType === 'movie'
    ? getMovieSectionRequests(locale)
    : getTvSectionRequests(locale)
  const [leadSection, ...remainingSections] = sections
  const streamingRequest = getStreamingDiscovery(mediaType, requestedProviderId, locale)
  const basePath = mediaType === 'movie' ? '/' : '/tv'

  return (
    <main>
      <Suspense fallback={<HeroSkeleton label={catalog.loadingFeatured} />}>
        <CatalogHero
          requests={sections}
          mediaType={mediaType}
          eyebrow={catalog.featured}
          heading={catalog.heading}
          errorTitle={catalog.unavailable}
          locale={locale}
        />
      </Suspense>
      <div className={CATALOG_RAIL_STACK_CLASS_NAME}>
        <Suspense fallback={<MediaSectionSkeleton label={getSectionLoadingLabel(leadSection.title, locale)} />}>
          <AsyncMediaSection request={leadSection.request} locale={locale} />
        </Suspense>
        <Suspense fallback={<MediaSectionSkeleton label={dictionary.sections.loadingStreaming} withToolbar />}>
          <StreamingProviderSection request={streamingRequest} locale={locale} basePath={basePath} />
        </Suspense>
        {remainingSections.map((section) => (
          <Suspense
            key={section.id}
            fallback={<MediaSectionSkeleton label={getSectionLoadingLabel(section.title, locale)} />}
          >
            <AsyncMediaSection request={section.request} locale={locale} />
          </Suspense>
        ))}
        {mediaType === 'movie' ? (
          <RecentlyViewedSection
            locale={locale}
            title={dictionary.sections.recentlyViewed}
            description={dictionary.sections.recentlyViewedDescription}
            backwardLabel={dictionary.common.scrollBackward(dictionary.sections.recentlyViewed)}
            forwardLabel={dictionary.common.scrollForward(dictionary.sections.recentlyViewed)}
          />
        ) : null}
      </div>
    </main>
  )
}
