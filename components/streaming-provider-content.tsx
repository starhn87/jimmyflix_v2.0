'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { MediaCard } from '@/components/media-card'
import { MediaRailTrack } from '@/components/media-rail-track'
import { MEDIA_RAIL_HEADER_CLASS_NAME, MEDIA_RAIL_TITLE_CLASS_NAME, MEDIA_RAIL_DESCRIPTION_CLASS_NAME } from '@/components/media-rail-styles'
import { MediaRailSkeletonCards } from '@/components/media-rail-skeleton'
import { StreamingProviderPicker } from '@/components/streaming-provider-picker'
import { useStreamingSection } from '@/components/use-streaming-section'
import { JsonLd } from '@/components/json-ld'
import { getLocalePath, type Locale } from '@/lib/i18n'
import type { Region } from '@/lib/region'
import { getStreamingUrl } from '@/lib/streaming'
import { streamingCache } from '@/lib/streaming-cache'
import { getItemListJsonLd } from '@/lib/structured-data'
import type { StreamingDiscoveryData } from '@/types/tmdb'

export interface StreamingMessages {
  picker: string
  attribution: string
  loading: string
  empty: string
  unavailable: string
  retry: string
  partial: string
  providers: Record<number, { title: string; carousel: string; previous: string; next: string }>
}

export function StreamingProviderContent({ initialData, locale, region, basePath, messages }: {
  initialData: StreamingDiscoveryData
  locale: Locale
  region: Region
  basePath: '/' | '/tv'
  messages: StreamingMessages
}) {
  const params = useSearchParams()
  const requestedId = Number(params.get('provider'))
  const { providers, section: initialSection } = initialData
  const provider = providers.find((item) => item.provider_id === requestedId) ?? providers[0]
  const selectedId = provider.provider_id
  const mediaType = initialSection.mediaType
  const keyFor = (id: number) => getStreamingUrl(locale, region, mediaType, id)
  const { data, error, retry } = useStreamingSection(
    keyFor(selectedId), keyFor(initialData.selectedProviderId), initialSection, initialData.fetchedAt,
  )
  const loading = !data && !error
  const labels = messages.providers[selectedId]
  const { title } = labels
  const prefetch = (id: number) => { void streamingCache.load(keyFor(id)) }

  const fallback = loading ? (
    <div role="status" aria-label={messages.loading} className="animate-pulse motion-reduce:animate-none" data-streaming-skeleton>
      <span className="sr-only">{messages.loading}</span>
      <MediaRailSkeletonCards />
    </div>
  ) : !data || data.items.length === 0 ? (
    <div className="mx-4 min-h-40 rounded-2xl border border-tone/8 bg-tone/4 p-6 text-sm text-subtle sm:mx-8 lg:mx-12" role={error ? 'alert' : undefined}>
      <p>{error ? messages.unavailable : messages.empty}</p>
      {error ? <button type="button" onClick={() => void retry()} className="mt-4 min-h-11 cursor-pointer rounded-full border border-tone/15 px-5 font-semibold text-ink outline-none hover:bg-tone/8 focus-visible:ring-3 focus-visible:ring-accent/40">{messages.retry}</button> : null}
    </div>
  ) : undefined

  return (
    <div className="streaming-provider-section">
      {data?.partial || (data && error) ? <p role="status" className="mx-4 mb-5 rounded-xl border border-tone/15 bg-tone/5 p-4 text-sm text-subtle sm:mx-8 lg:mx-12">{messages.partial}</p> : null}
      {data ? <JsonLd data={getItemListJsonLd(data.items, mediaType, title, locale)} /> : null}
      <section aria-labelledby={`${initialSection.id}-title`}>
        <div className={MEDIA_RAIL_HEADER_CLASS_NAME}>
          <h2 id={`${initialSection.id}-title`} className={MEDIA_RAIL_TITLE_CLASS_NAME}>{title}</h2>
          <div className={MEDIA_RAIL_DESCRIPTION_CLASS_NAME}>
            <Link href="https://www.justwatch.com/" target="_blank" rel="noreferrer" className="text-xs text-faint underline decoration-tone/25 underline-offset-4 transition hover:text-ink">{messages.attribution}</Link>
          </div>
          <div className="mt-4">
            <StreamingProviderPicker
              providers={providers}
              selectedProviderId={selectedId}
              pathname={getLocalePath(locale, basePath)}
              sectionId={initialSection.id}
              label={messages.picker}
              pending={loading}
              onPrefetch={prefetch}
              onSelect={(id, href) => {
                // Update only this list, while preserving native links and back/forward history.
                window.history.pushState(null, '', href)
                prefetch(id)
              }}
            />
          </div>
        </div>
        {fallback ?? <MediaRailTrack
          key={selectedId}
          railId={`${initialSection.id}-rail`}
          label={labels.carousel}
          backwardLabel={labels.previous}
          forwardLabel={labels.next}
          animateEntry
          items={data!.items.map((item) => <MediaCard key={`${mediaType}-${item.id}`} item={item} mediaType={mediaType} locale={locale} />)}
        />}
      </section>
    </div>
  )
}
