import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AsyncMediaSection, CatalogHero } from '@/components/catalog-content'
import { HeroSkeleton, MediaSectionSkeleton } from '@/components/loading-skeletons'
import { getDictionary } from '@/lib/dictionaries'
import { isLocale } from '@/lib/i18n'
import { getMovieSectionRequests } from '@/lib/tmdb'

export const revalidate = 1800

interface MoviesPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: MoviesPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dictionary = getDictionary(locale)
  return {
    title: dictionary.movies.metadataTitle,
    description: dictionary.movies.metadataDescription,
  }
}

export default async function MoviesPage({ params }: MoviesPageProps) {
  const { locale } = await params
  if (!isLocale(locale)) return null
  const dictionary = getDictionary(locale)
  const sections = getMovieSectionRequests(locale)

  return (
    <main>
      <Suspense fallback={<HeroSkeleton label={dictionary.movies.loadingFeatured} />}>
        <CatalogHero
          requests={sections}
          mediaType="movie"
          eyebrow={dictionary.movies.featured}
          heading={dictionary.movies.heading}
          errorTitle={dictionary.movies.unavailable}
          locale={locale}
        />
      </Suspense>
      <div className="relative z-10 -mt-8 space-y-10 pb-20 sm:space-y-14">
        {sections.map((section) => (
          <Suspense
            key={section.id}
            fallback={<MediaSectionSkeleton label={locale === 'ko' ? `${section.title} 불러오는 중` : `Loading ${section.title}`} />}
          >
            <AsyncMediaSection request={section.request} locale={locale} />
          </Suspense>
        ))}
      </div>
    </main>
  )
}
