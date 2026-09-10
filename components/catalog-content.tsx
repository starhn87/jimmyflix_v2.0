import 'server-only'

import { ErrorState } from '@/components/error-state'
import { Hero } from '@/components/hero'
import { MediaSection } from '@/components/media-section'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import type { MediaSectionRequest } from '@/lib/tmdb'
import type { MediaType } from '@/types/tmdb'

interface CatalogHeroProps {
  requests: MediaSectionRequest[]
  mediaType: MediaType
  eyebrow: string
  heading: string
  errorTitle: string
  locale: Locale
}

export async function CatalogHero({
  requests,
  mediaType,
  eyebrow,
  heading,
  errorTitle,
  locale,
}: CatalogHeroProps) {
  const dictionary = getDictionary(locale)
  for (const { request } of requests) {
    const section = await request
    const featured = section.items[0]

    if (featured) {
      return <Hero item={featured} mediaType={mediaType} eyebrow={eyebrow} locale={locale} />
    }
  }

  return (
    <section className="flex min-h-[320px] items-center px-4 sm:px-6 lg:px-10">
      <h1 className="sr-only">{heading}</h1>
      <ErrorState
        title={errorTitle}
        message={dictionary.common.catalogUnavailable}
        retryLabel={dictionary.common.retry}
        retryingLabel={dictionary.common.retrying}
      />
    </section>
  )
}

export async function AsyncMediaSection({
  request,
  locale,
}: {
  request: MediaSectionRequest['request']
  locale: Locale
}) {
  const section = await request
  return <MediaSection section={section} locale={locale} />
}
