import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AsyncMediaSection, CatalogHero } from '@/components/catalog-content'
import { HeroSkeleton, MediaSectionSkeleton } from '@/components/loading-skeletons'
import { getTvSectionRequests } from '@/lib/tmdb'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'TV shows',
  description: 'Browse top-rated, popular, currently airing, and daily TV shows.',
}

export default function TvPage() {
  const sections = getTvSectionRequests()

  return (
    <main>
      <Suspense fallback={<HeroSkeleton label="Loading featured TV show" />}>
        <CatalogHero
          requests={sections}
          mediaType="tv"
          eyebrow="Featured series"
          heading="TV shows"
          errorTitle="TV shows are temporarily unavailable"
        />
      </Suspense>
      <div className="relative z-10 -mt-8 space-y-10 pb-20 sm:space-y-14">
        {sections.map((section) => (
          <Suspense
            key={section.id}
            fallback={<MediaSectionSkeleton label={`Loading ${section.title}`} />}
          >
            <AsyncMediaSection request={section.request} />
          </Suspense>
        ))}
      </div>
    </main>
  )
}
