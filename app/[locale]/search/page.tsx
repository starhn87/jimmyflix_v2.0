import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { ErrorState } from '@/components/error-state'
import { SearchResultsSkeleton } from '@/components/loading-skeletons'
import { MediaGrid } from '@/components/media-grid'
import { getDictionary, type Dictionary } from '@/lib/dictionaries'
import { getLocalePath, isLocale, type Locale } from '@/lib/i18n'
import { getFirstSearchParam } from '@/lib/params'
import { MAX_SEARCH_LENGTH } from '@/lib/search'
import { searchCatalog } from '@/lib/tmdb'

interface SearchPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string | string[] }>
}

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dictionary = getDictionary(locale)
  return {
    title: dictionary.search.metadataTitle,
    description: dictionary.search.metadataDescription,
  }
}

function EmptyResults({ query, dictionary }: { query: string; dictionary: Dictionary }) {
  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-tone/10 bg-tone/4 px-4 py-12 text-center sm:px-6">
      <h2 className="text-xl font-semibold text-ink">{dictionary.search.noMatches(query)}</h2>
      <p className="mt-3 text-sm leading-6 text-subtle">
        {dictionary.search.noMatchesHelp}
      </p>
    </section>
  )
}

async function SearchResults({
  query,
  locale,
  dictionary,
}: {
  query: string
  locale: Locale
  dictionary: Dictionary
}) {
  const { movies, tvShows, people, keywords, unavailable } = await searchCatalog(query, locale)
  const total = movies.length + tvShows.length

  return (
    <div className="mx-auto max-w-[1600px] space-y-10 px-4 sm:px-6 lg:px-10">
      {total > 0 ? (
        <div className="space-y-2 text-sm text-subtle">
          <p>{total === 1 ? dictionary.search.showingOne : dictionary.search.showingMany(total)}</p>
          {people.length ? (
            <div className="flex flex-wrap items-center gap-2">
              <span>{dictionary.search.relatedPeople}:</span>
              <ul className="flex flex-wrap gap-2">
                {people.map((person) => (
                  <li key={person.id}>
                    <Link
                      href={getLocalePath(locale, `/people/${person.id}`)}
                      prefetch={false}
                      className="inline-flex min-h-8 items-center rounded-full border border-tone/15 bg-tone/5 px-3 text-xs font-medium text-ink outline-none transition hover:border-accent/50 hover:text-accent-strong focus-visible:ring-3 focus-visible:ring-accent/40"
                    >
                      {person.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {keywords.length ? <p>{dictionary.search.topics}: {keywords.join(' · ')}</p> : null}
        </div>
      ) : null}

      {unavailable.length ? (
        <ErrorState
          compact
          title={total ? dictionary.search.partialError : dictionary.search.totalError}
          message={dictionary.search.unavailableSources(unavailable.join(', '))}
          retryLabel={dictionary.common.retry}
          retryingLabel={dictionary.common.retrying}
        />
      ) : null}

      {movies.length > 0 ? (
        <section aria-labelledby="movie-results-title">
          <h2 id="movie-results-title" className="mb-5 text-xl font-semibold text-ink sm:text-2xl">
            {dictionary.search.movies}
          </h2>
          <MediaGrid items={movies} mediaType="movie" label={dictionary.search.movieResultsLabel} locale={locale} />
        </section>
      ) : null}

      {tvShows.length > 0 ? (
        <section aria-labelledby="tv-results-title">
          <h2 id="tv-results-title" className="mb-5 text-xl font-semibold text-ink sm:text-2xl">
            {dictionary.search.tvShows}
          </h2>
          <MediaGrid items={tvShows} mediaType="tv" label={dictionary.search.tvResultsLabel} locale={locale} />
        </section>
      ) : null}

      {total === 0 && unavailable.length === 0 ? <EmptyResults query={query} dictionary={dictionary} /> : null}
    </div>
  )
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const [{ locale }, queryParams] = await Promise.all([params, searchParams])
  if (!isLocale(locale)) return null
  const dictionary = getDictionary(locale)
  const rawQuery = getFirstSearchParam(queryParams.q)
  const query = rawQuery?.trim() || ''

  if (!query) {
    return (
      <main className="mx-auto grid min-h-[55vh] max-w-3xl place-items-center px-4 py-16 text-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-accent uppercase">{dictionary.search.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-ink sm:text-5xl">{dictionary.search.heading}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-subtle sm:text-base">
            {dictionary.search.intro}
          </p>
          <ul aria-label={dictionary.search.suggestionsLabel} className="mt-7 flex flex-wrap justify-center gap-3">
            {dictionary.search.suggestions.map((suggestion) => (
              <li key={suggestion}>
                <Link href={`${getLocalePath(locale, '/search')}?q=${encodeURIComponent(suggestion)}`} prefetch={false} className="inline-flex min-h-11 items-center rounded-full border border-tone/15 px-4 text-sm text-ink outline-none transition hover:border-accent/60 hover:bg-tone/5 focus-visible:ring-3 focus-visible:ring-accent/40">
                  {suggestion}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    )
  }

  if (query.length > MAX_SEARCH_LENGTH) {
    return (
      <main className="px-4 py-12">
        <ErrorState
          title={dictionary.search.shorterTitle}
          message={dictionary.search.shorterMessage(MAX_SEARCH_LENGTH)}
          retry={false}
          backHref={getLocalePath(locale, '/search')}
          backLabel={dictionary.search.clear}
        />
      </main>
    )
  }

  return (
    <main className="pt-10 pb-20 sm:pt-14">
      <header className="mx-auto max-w-[1600px] px-4 pb-6 sm:px-6 lg:px-10">
        <p className="text-xs font-semibold tracking-[0.24em] text-accent uppercase">{dictionary.search.resultsEyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] wrap-break-word text-ink sm:text-5xl">“{query}”</h1>
      </header>
      <Suspense key={`results-${locale}-${query}`} fallback={<SearchResultsSkeleton label={dictionary.search.loadingResults} />}>
        <SearchResults query={query} locale={locale} dictionary={dictionary} />
      </Suspense>
    </main>
  )
}
