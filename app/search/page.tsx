import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { ErrorState } from '@/components/error-state'
import { SearchResultsSkeleton } from '@/components/loading-skeletons'
import { MediaGrid } from '@/components/media-grid'
import { MAX_SEARCH_LENGTH } from '@/lib/search'
import { searchCatalog } from '@/lib/tmdb'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Find movies and TV shows by title, actor, or topic on Jimmyflix.',
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>
}

function EmptyResults({ query }: { query: string }) {
  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-tone/10 bg-tone/4 px-6 py-12 text-center">
      <h2 className="text-xl font-semibold text-ink">No matches for “{query}”</h2>
      <p className="mt-3 text-sm leading-6 text-subtle">
        Check the spelling, try an actor&apos;s full name, or use a short topic such as “time travel”.
      </p>
    </section>
  )
}

async function SearchResults({ query }: { query: string }) {
  const { movies, tvShows, people, keywords, unavailable } = await searchCatalog(query)
  const total = movies.length + tvShows.length

  return (
    <div className="mx-auto max-w-[1600px] space-y-10 px-4 sm:px-6 lg:px-10">
      {total > 0 ? (
        <div className="space-y-2 text-sm text-subtle">
          <p>{total === 1 ? 'Showing 1 title' : `Showing ${total} titles`}</p>
          {people.length ? <p>Related people: {people.join(' · ')}</p> : null}
          {keywords.length ? <p>Topics: {keywords.join(' · ')}</p> : null}
        </div>
      ) : null}

      {unavailable.length ? (
        <ErrorState
          compact
          title={total ? "Some results couldn't load" : "Search is temporarily unavailable"}
          message={`${unavailable.join(', ')} could not be loaded. Please try again.`}
        />
      ) : null}

      {movies.length > 0 ? (
        <section aria-labelledby="movie-results-title">
          <h2 id="movie-results-title" className="mb-5 text-xl font-semibold text-ink sm:text-2xl">
            Movies
          </h2>
          <MediaGrid items={movies} mediaType="movie" label="Movie search results" />
        </section>
      ) : null}

      {tvShows.length > 0 ? (
        <section aria-labelledby="tv-results-title">
          <h2 id="tv-results-title" className="mb-5 text-xl font-semibold text-ink sm:text-2xl">
            TV shows
          </h2>
          <MediaGrid items={tvShows} mediaType="tv" label="TV show search results" />
        </section>
      ) : null}

      {total === 0 && unavailable.length === 0 ? <EmptyResults query={query} /> : null}
    </div>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q
  const query = rawQuery?.trim() || ''

  if (!query) {
    return (
      <main className="mx-auto grid min-h-[55vh] max-w-3xl place-items-center px-4 py-16 text-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-accent uppercase">Find your next watch</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-ink sm:text-5xl">Search every story</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-subtle sm:text-base">
            Use the search bar above to explore titles, actors, and topics.
          </p>
          <ul aria-label="Search suggestions" className="mt-7 flex flex-wrap justify-center gap-3">
            {['Inception', 'Tom Hanks', 'time travel'].map((suggestion) => (
              <li key={suggestion}>
                <Link href={`/search?q=${encodeURIComponent(suggestion)}`} prefetch={false} className="inline-flex min-h-11 items-center rounded-full border border-tone/15 px-4 text-sm text-ink outline-none transition hover:border-accent/60 hover:bg-tone/5 focus-visible:ring-3 focus-visible:ring-accent/40">
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
        <ErrorState title="Try a shorter search" message={`Use up to ${MAX_SEARCH_LENGTH} characters for a title, actor, or topic.`} retry={false} backHref="/search" backLabel="Clear search" />
      </main>
    )
  }

  return (
    <main className="pt-10 pb-20 sm:pt-14">
      <header className="mx-auto max-w-[1600px] px-4 pb-6 sm:px-6 lg:px-10">
        <p className="text-xs font-semibold tracking-[0.24em] text-accent uppercase">Search results</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] wrap-break-word text-ink sm:text-5xl">“{query}”</h1>
      </header>
      <Suspense key={`results-${query}`} fallback={<SearchResultsSkeleton />}>
        <SearchResults query={query} />
      </Suspense>
    </main>
  )
}
