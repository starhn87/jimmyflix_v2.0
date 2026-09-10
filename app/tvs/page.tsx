import type { Metadata } from 'next'
import { ErrorState } from '@/components/error-state'
import { Hero } from '@/components/hero'
import { MediaSection } from '@/components/media-section'
import { getTvSections } from '@/lib/tmdb'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'TV shows',
  description: 'Browse top-rated, popular, currently airing, and daily TV shows.',
}

export default async function TvPage() {
  const sections = await getTvSections()
  const featured = sections.find((section) => section.items.length > 0)?.items[0]

  return (
    <main>
      {featured ? (
        <Hero item={featured} mediaType="tv" eyebrow="Featured series" />
      ) : (
        <div className="px-4 sm:px-6 lg:px-10">
          <h1 className="sr-only">TV shows</h1>
          <ErrorState
            title="TV shows are temporarily unavailable"
            message="We couldn't load the catalog right now."
          />
        </div>
      )}
      <div className={`relative z-10 space-y-10 pb-20 sm:space-y-14 ${featured ? '-mt-8' : ''}`}>
        {sections.map((section) => (
          <MediaSection key={section.id} section={section} />
        ))}
      </div>
    </main>
  )
}
