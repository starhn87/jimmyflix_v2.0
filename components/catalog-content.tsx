import 'server-only'

import { ErrorState } from '@/components/error-state'
import { Hero } from '@/components/hero'
import { MediaSection } from '@/components/media-section'
import type { MediaSectionRequest } from '@/lib/tmdb'
import type { MediaType } from '@/types/tmdb'

interface CatalogHeroProps {
  requests: MediaSectionRequest[]
  mediaType: MediaType
  eyebrow: string
  heading: string
  errorTitle: string
}

export async function CatalogHero({
  requests,
  mediaType,
  eyebrow,
  heading,
  errorTitle,
}: CatalogHeroProps) {
  for (const { request } of requests) {
    const section = await request
    const featured = section.items[0]

    if (featured) {
      return <Hero item={featured} mediaType={mediaType} eyebrow={eyebrow} />
    }
  }

  return (
    <section className="flex min-h-[320px] items-center px-4 sm:px-6 lg:px-10">
      <h1 className="sr-only">{heading}</h1>
      <ErrorState
        title={errorTitle}
        message="We couldn't load the catalog right now."
      />
    </section>
  )
}

export async function AsyncMediaSection({
  request,
}: {
  request: MediaSectionRequest['request']
}) {
  const section = await request
  return <MediaSection section={section} />
}
