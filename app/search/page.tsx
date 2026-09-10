import type { Metadata } from 'next'
import { ErrorState } from '@/components/error-state'
import { MediaGrid } from '@/components/media-grid'
import { SearchForm } from '@/components/search-form'
import { searchMovies, searchTv } from '@/lib/tmdb'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search the Jimmyflix movie and TV catalog.',
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>
}

function EmptyResults({ query }: { query: string }) {
  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/4 px-6 py-12 text-center">
      <h2 className="text-xl font-semibold text-white">No matches for “{query}”</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400">
        Check the spelling or try a shorter title.
      </p>
    </section>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q
  const query = rawQuery?.trim() || ''

  if (!query) {
    return (
      <main>
        <SearchForm />
      </main>
    )
  }

  const [moviesResult, tvResult] = await Promise.allSettled([
    searchMovies(query),
    searchTv(query),
  ])
  const movies = moviesResult.status === 'fulfilled' ? moviesResult.value : []
  const tvShows = tvResult.status === 'fulfilled' ? tvResult.value : []
  const total = movies.length + tvShows.length

  return (
    <main className="pb-20">
      <SearchForm key={query} initialQuery={query} compact />
      <header className="mx-auto max-w-[1600px] px-4 pb-8 sm:px-6 lg:px-10">
        <p className="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">
          Search results
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-white sm:text-5xl">
          “{query}”
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          {total === 1 ? '1 title found' : `${total} titles found`}
        </p>
      </header>

      <div className="mx-auto max-w-[1600px] space-y-14 px-4 sm:px-6 lg:px-10">
        {moviesResult.status === 'rejected' ? (
          <ErrorState
            compact
            title="Couldn't search movies"
            message="Movie results are temporarily unavailable."
          />
        ) : movies.length > 0 ? (
          <section aria-labelledby="movie-results-title">
            <h2 id="movie-results-title" className="mb-5 text-xl font-semibold text-white sm:text-2xl">
              Movies
            </h2>
            <MediaGrid items={movies} mediaType="movie" label="Movie search results" />
          </section>
        ) : null}

        {tvResult.status === 'rejected' ? (
          <ErrorState
            compact
            title="Couldn't search TV shows"
            message="TV results are temporarily unavailable."
          />
        ) : tvShows.length > 0 ? (
          <section aria-labelledby="tv-results-title">
            <h2 id="tv-results-title" className="mb-5 text-xl font-semibold text-white sm:text-2xl">
              TV shows
            </h2>
            <MediaGrid items={tvShows} mediaType="tv" label="TV show search results" />
          </section>
        ) : null}

        {total === 0 && moviesResult.status === 'fulfilled' && tvResult.status === 'fulfilled' ? (
          <EmptyResults query={query} />
        ) : null}
      </div>
    </main>
  )
}
