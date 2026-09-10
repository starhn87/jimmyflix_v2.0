import type { Metadata } from 'next'
import { ErrorState } from '@/components/error-state'
import { Hero } from '@/components/hero'
import { MediaSection } from '@/components/media-section'
import { getMovieSections } from '@/lib/tmdb'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Movies',
  description: 'Browse movies now playing, top rated, upcoming, and popular.',
}

export default async function MoviesPage() {
  const sections = await getMovieSections()
  const featured = sections.find((section) => section.items.length > 0)?.items[0]

  return (
    <main>
      {featured ? (
        <Hero item={featured} mediaType="movie" eyebrow="Featured movie" />
      ) : (
        <div className="px-4 sm:px-6 lg:px-10">
          <h1 className="sr-only">Movies</h1>
          <ErrorState
            title="Movies are temporarily unavailable"
            message="We couldn't load the catalog right now."
          />
        </div>
      )}
      <div className={`relative z-10 space-y-10 pb-20 sm:space-y-14 ${featured ? '-mt-8' : ''}`}>
        {sections.map((section, index) => (
          <MediaSection key={section.id} section={section} prioritizeFirst={!featured && index === 0} />
        ))}
      </div>
    </main>
  )
}
