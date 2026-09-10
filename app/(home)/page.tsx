import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AsyncMediaSection, CatalogHero } from '@/components/catalog-content'
import { HeroSkeleton, MediaSectionSkeleton } from '@/components/loading-skeletons'
import { getMovieSectionRequests } from '@/lib/tmdb'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Movies',
  description: 'Browse movies now playing, top rated, upcoming, and popular.',
}

export default function MoviesPage() {
  const sections = getMovieSectionRequests()

  return (
    <main>
      <Suspense fallback={<HeroSkeleton label="Loading featured movie" />}>
        <CatalogHero
          requests={sections}
          mediaType="movie"
          eyebrow="Featured movie"
          heading="Movies"
          errorTitle="Movies are temporarily unavailable"
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
