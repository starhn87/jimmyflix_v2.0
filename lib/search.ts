import type { Keyword, MediaItem, MediaType, PersonCredits, PersonSearchResult } from '@/types/tmdb'

const MAX_PEOPLE = 3
const MAX_KEYWORDS = 3
const MAX_RESULTS_PER_TYPE = 60
export const MAX_SEARCH_LENGTH = 200

export interface SearchSources {
  movies: (query: string) => Promise<MediaItem[]>
  tv: (query: string) => Promise<MediaItem[]>
  people: (query: string) => Promise<PersonSearchResult[]>
  keywords: (query: string) => Promise<Keyword[]>
  credits: (id: number) => Promise<PersonCredits>
  discover: (mediaType: MediaType, keywordIds: number[]) => Promise<MediaItem[]>
}

export interface CatalogSearchResult {
  movies: MediaItem[]
  tvShows: MediaItem[]
  people: string[]
  keywords: string[]
  unavailable: string[]
}

const normalizeName = (value: string) => value.trim().toLocaleLowerCase('en').normalize('NFKC')

function selectMatches<T extends { id: number; name: string }>(items: T[], query: string, limit: number) {
  const unique = [...new Map(items.filter((item) => Number.isSafeInteger(item.id) && item.id > 0).map((item) => [item.id, item])).values()]
  const exact = unique.filter((item) => normalizeName(item.name) === normalizeName(query))
  return (exact.length ? exact : unique).slice(0, limit)
}

function ranked(items: MediaItem[]) {
  return [...items].sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
}

function mergeResults(mediaType: MediaType, direct: MediaItem[], related: MediaItem[]) {
  const result = new Map<number, MediaItem>()
  for (const item of [...direct, ...ranked(related)]) {
    if (item.adult || (item.media_type && item.media_type !== mediaType)) continue
    if (!result.has(item.id)) result.set(item.id, item)
    if (result.size === MAX_RESULTS_PER_TYPE) break
  }
  return [...result.values()]
}

export async function runCatalogSearch(rawQuery: string, sources: SearchSources): Promise<CatalogSearchResult> {
  const query = rawQuery.trim()
  if (query.length > MAX_SEARCH_LENGTH) throw new RangeError('Search query is too long.')
  if (!query) return { movies: [], tvShows: [], people: [], keywords: [], unavailable: [] }

  const unavailable: string[] = []
  const read = async <T>(promise: Promise<T>, label: string, fallback: T): Promise<T> => {
    try {
      return await promise
    } catch {
      unavailable.push(label)
      return fallback
    }
  }

  // Start all four searches together; expand each source as soon as it resolves.
  const moviesRequest = read(sources.movies(query), 'Movie titles', [])
  const tvRequest = read(sources.tv(query), 'TV titles', [])
  const peopleRequest = read(sources.people(query), 'People', []).then(async (matches) => {
    const people = selectMatches(matches.filter((person) => !person.adult), query, MAX_PEOPLE)
    const groups = await Promise.all(people.map(async (person) => {
      const credits = await read(sources.credits(person.id), `Credits for ${person.name}`, {
        cast: person.known_for || [], crew: [],
      })
      return { name: person.name, items: [...credits.cast, ...credits.crew] }
    }))
    return {
      names: groups.filter((group) => group.items.some((item) => !item.adult && (item.media_type === 'movie' || item.media_type === 'tv'))).map((group) => group.name),
      items: groups.flatMap((group) => group.items).filter((item) => item.media_type === 'movie' || item.media_type === 'tv'),
    }
  })
  const keywordsRequest = read(sources.keywords(query), 'Topics', []).then(async (matches) => {
    const keywords = selectMatches(matches, query, MAX_KEYWORDS)
    if (!keywords.length) return { names: [], movies: [], tvShows: [] }
    const ids = keywords.map((keyword) => keyword.id)
    const [movies, tvShows] = await Promise.all([
      read(sources.discover('movie', ids), 'Movies by topic', []),
      read(sources.discover('tv', ids), 'TV shows by topic', []),
    ])
    return { names: keywords.map((keyword) => keyword.name), movies, tvShows }
  })

  const [movies, tvShows, people, keywords] = await Promise.all([
    moviesRequest, tvRequest, peopleRequest, keywordsRequest,
  ])

  return {
    movies: mergeResults('movie', movies, [
      ...people.items.filter((item) => item.media_type === 'movie'), ...keywords.movies,
    ]),
    tvShows: mergeResults('tv', tvShows, [
      ...people.items.filter((item) => item.media_type === 'tv'), ...keywords.tvShows,
    ]),
    people: people.names,
    keywords: keywords.names,
    unavailable,
  }
}
