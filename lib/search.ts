import type { Keyword, MediaItem, MediaType, PersonCredits, PersonSearchResult } from '@/types/tmdb'

const MAX_PEOPLE = 3
const MAX_PERSON_RESULTS = 12
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
  people: Array<Pick<PersonSearchResult, 'id' | 'name' | 'profile_path'>>
  keywords: string[]
  unavailable: string[]
}

export interface SearchSourceLabels {
  movieTitles: string
  tvTitles: string
  people: string
  creditsFor: (name: string) => string
  topics: string
  moviesByTopic: string
  tvByTopic: string
}

const defaultSourceLabels: SearchSourceLabels = {
  movieTitles: 'Movie titles',
  tvTitles: 'TV titles',
  people: 'People',
  creditsFor: (name) => `Credits for ${name}`,
  topics: 'Topics',
  moviesByTopic: 'Movies by topic',
  tvByTopic: 'TV shows by topic',
}

const normalizeName = (value: string) => value.trim().toLocaleLowerCase('en').normalize('NFKC')

function selectMatches<T extends { id: number; name: string }>(items: T[], query: string, limit: number) {
  const unique = [...new Map(items.filter((item) => Number.isSafeInteger(item.id) && item.id > 0).map((item) => [item.id, item])).values()]
  const exact = unique.filter((item) => normalizeName(item.name) === normalizeName(query))
  return (exact.length ? exact : unique).slice(0, limit)
}

function selectPeople(items: PersonSearchResult[], query: string) {
  const unique = [...new Map(items
    .filter((person) => !person.adult && Number.isSafeInteger(person.id) && person.id > 0 && person.name?.trim())
    .map((person) => [person.id, person])).values()]
  return unique
    .sort((a, b) => Number(normalizeName(b.name) === normalizeName(query)) - Number(normalizeName(a.name) === normalizeName(query)))
    .slice(0, MAX_PERSON_RESULTS)
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

export async function runCatalogSearch(
  rawQuery: string,
  sources: SearchSources,
  labels: SearchSourceLabels = defaultSourceLabels,
): Promise<CatalogSearchResult> {
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
  const moviesRequest = read(sources.movies(query), labels.movieTitles, [])
  const tvRequest = read(sources.tv(query), labels.tvTitles, [])
  const peopleRequest = read(sources.people(query), labels.people, []).then(async (matches) => {
    const people = selectPeople(matches, query)
    const creditedPeople = selectMatches(people, query, MAX_PEOPLE)
    const groups = await Promise.all(creditedPeople.map(async (person) => {
      const credits = await read(sources.credits(person.id), labels.creditsFor(person.name), {
        cast: person.known_for || [], crew: [],
      })
      return [...credits.cast, ...credits.crew]
    }))
    return {
      people: people.map(({ id, name, profile_path }) => ({
        id,
        name,
        ...(profile_path !== undefined ? { profile_path } : {}),
      })),
      items: groups.flat().filter((item) => item.media_type === 'movie' || item.media_type === 'tv'),
    }
  })
  const keywordsRequest = read(sources.keywords(query), labels.topics, []).then(async (matches) => {
    const keywords = selectMatches(matches, query, MAX_KEYWORDS)
    if (!keywords.length) return { names: [], movies: [], tvShows: [] }
    const ids = keywords.map((keyword) => keyword.id)
    const [movies, tvShows] = await Promise.all([
      read(sources.discover('movie', ids), labels.moviesByTopic, []),
      read(sources.discover('tv', ids), labels.tvByTopic, []),
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
    people: people.people,
    keywords: keywords.names,
    unavailable,
  }
}
