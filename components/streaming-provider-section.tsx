import 'server-only'

import { StreamingProviderContent } from '@/components/streaming-provider-content'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import type { Region } from '@/lib/region'
import type { StreamingDiscoveryData } from '@/types/tmdb'

export async function StreamingProviderSection({ request, locale, region, basePath }: {
  request: Promise<StreamingDiscoveryData>
  locale: Locale
  region: Region
  basePath: '/' | '/tv'
}) {
  const data = await request
  const dictionary = getDictionary(locale)
  const titleFor = data.section.mediaType === 'movie' ? dictionary.sections.streamingMovies : dictionary.sections.streamingShows
  const messages = {
    picker: dictionary.sections.providerPickerLabel,
    attribution: dictionary.sections.justWatchDiscoveryAttribution,
    loading: dictionary.sections.loadingStreaming,
    empty: dictionary.common.sectionEmpty,
    unavailable: dictionary.common.sectionUnavailableMessage,
    retry: dictionary.common.retry,
    partial: dictionary.common.partialResults,
    providers: Object.fromEntries(data.providers.map((provider) => {
      const title = titleFor(provider.provider_name)
      return [provider.provider_id, {
        title,
        carousel: dictionary.common.carouselLabel(title),
        previous: dictionary.common.scrollBackward(title),
        next: dictionary.common.scrollForward(title),
      }]
    })),
  }
  return <StreamingProviderContent key={`${locale}:${region}:${basePath}`} initialData={data} locale={locale} region={region} basePath={basePath} messages={messages} />
}
