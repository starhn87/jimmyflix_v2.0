import 'server-only'

import Link from 'next/link'
import { MediaSection } from '@/components/media-section'
import { StreamingProviderPicker } from '@/components/streaming-provider-picker'
import { getDictionary } from '@/lib/dictionaries'
import { getLocalePath, type Locale } from '@/lib/i18n'
import type { StreamingDiscoveryData } from '@/types/tmdb'

interface StreamingProviderSectionProps {
  request: Promise<StreamingDiscoveryData>
  locale: Locale
  basePath: '/' | '/tv'
}

export async function StreamingProviderSection({
  request,
  locale,
  basePath,
}: StreamingProviderSectionProps) {
  const dictionary = getDictionary(locale)
  const data = await request
  const section = data.section

  const providerPicker = (
    <StreamingProviderPicker
      providers={data.providers}
      selectedProviderId={data.selectedProviderId}
      pathname={getLocalePath(locale, basePath)}
      sectionId={section.id}
      label={dictionary.sections.providerPickerLabel}
    />
  )

  const attribution = (
    <Link
      href="https://www.justwatch.com/"
      target="_blank"
      rel="noreferrer"
      className="text-xs text-faint underline decoration-tone/25 underline-offset-4 transition hover:text-ink"
    >
      {dictionary.sections.justWatchDiscoveryAttribution}
    </Link>
  )

  return (
    <div className="streaming-provider-section">
      <MediaSection
        section={section}
        locale={locale}
        toolbar={providerPicker}
        description={attribution}
        transitionKey={data.selectedProviderId}
      />
    </div>
  )
}
