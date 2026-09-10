import 'server-only'

import { cache } from 'react'
import type {
  CastMember,
  CollectionDetail,
  MediaDetail,
  MediaItem,
  MediaSectionData,
  MediaType,
  TimeWindow,
  TmdbListResponse,
} from '@/types/tmdb'

const API_BASE_URL = 'https://api.themoviedb.org/3/'
const DEFAULT_REVALIDATE_SECONDS = 60 * 30

type QueryValue = string | number | boolean | undefined

export class TmdbNotFoundError extends Error {
  constructor() {
    super('The requested title was not found.')
    this.name = 'TmdbNotFoundError'
  }
}

const getApiKey = () => {
  const key = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_API_KEY

  if (!key) {
    throw new Error('TMDB_API_KEY is not configured.')
  }

  return key
}

async function tmdbFetch<T>(
  path: string,
  query: Record<string, QueryValue> = {},
  revalidate = DEFAULT_REVALIDATE_SECONDS,
): Promise<T> {
  const url = new URL(path.replace(/^\//, ''), API_BASE_URL)
  url.searchParams.set('api_key', getApiKey())
  url.searchParams.set('language', 'en-US')

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate },
  })

  if (response.status === 404) {
    throw new TmdbNotFoundError()
  }

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}.`)
  }

  return (await response.json()) as T
}

const getList = async (path: string, revalidate?: number) => {
  const response = await tmdbFetch<TmdbListResponse<MediaItem>>(
    path,
    {},
    revalidate,
  )
  return response.results
}

interface SectionDefinition {
  id: string
  title: string
  description: string
  mediaType: MediaType
  load: () => Promise<MediaItem[]>
}

const settleSections = async (
  definitions: SectionDefinition[],
): Promise<MediaSectionData[]> => {
  const results = await Promise.allSettled(
    definitions.map((definition) => definition.load()),
  )

  return definitions.map((definition, index) => {
    const result = results[index]
    return {
      id: definition.id,
      title: definition.title,
      description: definition.description,
      mediaType: definition.mediaType,
      items: result.status === 'fulfilled' ? result.value : [],
      error: result.status === 'rejected',
    }
  })
}

export const getMovieSections = () =>
  settleSections([
    {
      id: 'now-playing',
      title: 'Now playing',
      description: 'Movies playing in theaters now',
      mediaType: 'movie',
      load: () => getList('movie/now_playing'),
    },
    {
      id: 'top-rated-movies',
      title: 'Top rated',
      description: 'Audience favorites with lasting appeal',
      mediaType: 'movie',
      load: () => getList('movie/top_rated'),
    },
    {
      id: 'upcoming',
      title: 'Coming soon',
      description: 'Upcoming releases to keep on your radar',
      mediaType: 'movie',
      load: () => getList('movie/upcoming'),
    },
    {
      id: 'popular-movies',
      title: 'Popular movies',
      description: 'The titles people are watching right now',
      mediaType: 'movie',
      load: () => getList('movie/popular'),
    },
  ])

export const getTvSections = () =>
  settleSections([
    {
      id: 'top-rated-tv',
      title: 'Top rated shows',
      description: 'Series with the strongest audience ratings',
      mediaType: 'tv',
      load: () => getList('tv/top_rated'),
    },
    {
      id: 'popular-tv',
      title: 'Popular shows',
      description: 'Series drawing the biggest audiences',
      mediaType: 'tv',
      load: () => getList('tv/popular'),
    },
    {
      id: 'on-the-air',
      title: 'On the air',
      description: 'Shows currently releasing new episodes',
      mediaType: 'tv',
      load: () => getList('tv/on_the_air'),
    },
    {
      id: 'airing-today',
      title: 'Airing today',
      description: 'New episodes scheduled for today',
      mediaType: 'tv',
      load: () => getList('tv/airing_today'),
    },
  ])

export const getTrendingSections = (window: TimeWindow) =>
  settleSections([
    {
      id: `trending-movies-${window}`,
      title: 'Trending movies',
      description: `Movies gaining attention this ${window}`,
      mediaType: 'movie',
      load: () => getList(`trending/movie/${window}`, 60 * 10),
    },
    {
      id: `trending-tv-${window}`,
      title: 'Trending shows',
      description: `Shows gaining attention this ${window}`,
      mediaType: 'tv',
      load: () => getList(`trending/tv/${window}`, 60 * 10),
    },
  ])

export const searchMovies = (query: string) =>
  tmdbFetch<TmdbListResponse<MediaItem>>(
    'search/movie',
    { query: query.trim(), include_adult: false },
    60 * 5,
  ).then((response) => response.results)

export const searchTv = (query: string) =>
  tmdbFetch<TmdbListResponse<MediaItem>>(
    'search/tv',
    { query: query.trim(), include_adult: false },
    60 * 5,
  ).then((response) => response.results)

export const getMovieDetail = cache((id: number) =>
  tmdbFetch<MediaDetail>(`movie/${id}`, { append_to_response: 'videos' }),
)

export const getTvDetail = cache((id: number) =>
  tmdbFetch<MediaDetail>(`tv/${id}`, { append_to_response: 'videos' }),
)

export const getCredits = cache(async (mediaType: MediaType, id: number) => {
  const response = await tmdbFetch<{ cast: CastMember[] }>(
    `${mediaType}/${id}/credits`,
  )
  return response.cast
})

export const getCollection = cache(async (id: number) => {
  const response = await tmdbFetch<CollectionDetail>(`collection/${id}`)
  return response.parts
})
