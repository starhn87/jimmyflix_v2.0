import 'server-only'

import { cache } from 'react'
import { getDictionary } from '@/lib/dictionaries'
import { tmdbLanguage, type Locale } from '@/lib/i18n'
import { runCatalogSearch } from '@/lib/search'
import type {
  CastMember,
  CollectionDetail,
  MediaDetail,
  MediaItem,
  MediaSectionData,
  MediaType,
  Keyword,
  PersonCredits,
  PersonSearchResult,
  TimeWindow,
  TmdbListResponse,
} from '@/types/tmdb'

const API_BASE_URL = 'https://api.themoviedb.org/3/'
const DEFAULT_REVALIDATE_SECONDS = 60 * 30

type QueryValue = string | number | boolean | undefined

interface TmdbFetchOptions {
  revalidate?: number
  timeoutMs?: number
  locale?: Locale
}

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
  {
    revalidate = DEFAULT_REVALIDATE_SECONDS,
    timeoutMs,
    locale = 'en',
  }: TmdbFetchOptions = {},
): Promise<T> {
  const url = new URL(path.replace(/^\//, ''), API_BASE_URL)
  url.searchParams.set('api_key', getApiKey())
  url.searchParams.set('language', tmdbLanguage[locale])

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate },
    signal: timeoutMs ? AbortSignal.timeout(timeoutMs) : undefined,
  })

  if (response.status === 404) {
    throw new TmdbNotFoundError()
  }

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}.`)
  }

  return (await response.json()) as T
}

const getList = async (path: string, locale: Locale, revalidate?: number) => {
  const response = await tmdbFetch<TmdbListResponse<MediaItem>>(
    path,
    {},
    { revalidate, locale },
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

export interface MediaSectionRequest {
  id: string
  title: string
  request: Promise<MediaSectionData>
}

const loadSection = async (
  definition: SectionDefinition,
): Promise<MediaSectionData> => {
  try {
    const items = await definition.load()
    return {
      id: definition.id,
      title: definition.title,
      description: definition.description,
      mediaType: definition.mediaType,
      items,
      error: false,
    }
  } catch {
    return {
      id: definition.id,
      title: definition.title,
      description: definition.description,
      mediaType: definition.mediaType,
      items: [],
      error: true,
    }
  }
}

const createSectionRequests = (
  definitions: SectionDefinition[],
): MediaSectionRequest[] =>
  definitions.map((definition) => ({
    id: definition.id,
    title: definition.title,
    request: loadSection(definition),
  }))

export const getMovieSectionRequests = (locale: Locale) => {
  const localized = getDictionary(locale).sections.movie
  const endpoints = ['movie/now_playing', 'movie/top_rated', 'movie/upcoming', 'movie/popular']

  return createSectionRequests(localized.map((section, index) => ({
    ...section,
    mediaType: 'movie' as const,
    load: () => getList(endpoints[index], locale),
  })))
}

export const getTvSectionRequests = (locale: Locale) => {
  const localized = getDictionary(locale).sections.tv
  const endpoints = ['tv/top_rated', 'tv/popular', 'tv/on_the_air', 'tv/airing_today']

  return createSectionRequests(localized.map((section, index) => ({
    ...section,
    mediaType: 'tv' as const,
    load: () => getList(endpoints[index], locale),
  })))
}

export const getTrendingSectionRequests = (window: TimeWindow, locale: Locale) => {
  const dictionary = getDictionary(locale)

  return createSectionRequests([
    {
      id: `trending-movies-${window}`,
      title: dictionary.sections.trendingMovies,
      description: dictionary.sections.trendingMoviesDescription(window),
      mediaType: 'movie',
      load: () => getList(`trending/movie/${window}`, locale, 60 * 10),
    },
    {
      id: `trending-tv-${window}`,
      title: dictionary.sections.trendingShows,
      description: dictionary.sections.trendingShowsDescription(window),
      mediaType: 'tv',
      load: () => getList(`trending/tv/${window}`, locale, 60 * 10),
    },
  ])
}

const searchMovies = (query: string, locale: Locale) =>
  tmdbFetch<TmdbListResponse<MediaItem>>(
    'search/movie',
    { query: query.trim(), include_adult: false },
    { revalidate: 60 * 5, timeoutMs: 5000, locale },
  ).then((response) => response.results)

const searchTv = (query: string, locale: Locale) =>
  tmdbFetch<TmdbListResponse<MediaItem>>(
    'search/tv',
    { query: query.trim(), include_adult: false },
    { revalidate: 60 * 5, timeoutMs: 5000, locale },
  ).then((response) => response.results)

export const searchCatalog = (query: string, locale: Locale) => runCatalogSearch(query, {
  movies: (term) => searchMovies(term, locale),
  tv: (term) => searchTv(term, locale),
  people: (term) => tmdbFetch<TmdbListResponse<PersonSearchResult>>(
    'search/person',
    { query: term, include_adult: false },
    { revalidate: 60 * 5, timeoutMs: 5000, locale },
  ).then((response) => response.results),
  keywords: (term) => tmdbFetch<TmdbListResponse<Keyword>>(
    'search/keyword',
    { query: term },
    { revalidate: 60 * 5, timeoutMs: 5000, locale },
  ).then((response) => response.results),
  credits: (id) => tmdbFetch<PersonCredits>(
    `person/${id}/combined_credits`,
    {},
    { revalidate: 60 * 30, timeoutMs: 5000, locale },
  ),
  discover: (mediaType, keywordIds) => tmdbFetch<TmdbListResponse<MediaItem>>(
    `discover/${mediaType}`,
    { with_keywords: keywordIds.join('|'), include_adult: false, sort_by: 'popularity.desc' },
    { revalidate: 60 * 5, timeoutMs: 5000, locale },
  ).then((response) => response.results),
}, locale === 'ko' ? {
  movieTitles: '영화 제목',
  tvTitles: 'TV 프로그램 제목',
  people: '인물',
  creditsFor: (name) => `${name}의 출연작`,
  topics: '주제',
  moviesByTopic: '주제별 영화',
  tvByTopic: '주제별 TV 프로그램',
} : undefined)

export const getMovieDetail = cache((id: number, locale: Locale) =>
  tmdbFetch<MediaDetail>(`movie/${id}`, { append_to_response: 'videos' }, { locale }),
)

export const getTvDetail = cache((id: number, locale: Locale) =>
  tmdbFetch<MediaDetail>(`tv/${id}`, { append_to_response: 'videos' }, { locale }),
)

export const getCredits = cache(async (mediaType: MediaType, id: number, locale: Locale) => {
  const response = await tmdbFetch<{ cast: CastMember[] }>(
    `${mediaType}/${id}/credits`,
    {},
    { locale },
  )
  return response.cast
})

export const getCollection = cache(async (id: number, locale: Locale) => {
  const response = await tmdbFetch<CollectionDetail>(`collection/${id}`, {}, { locale })
  return response.parts
})
