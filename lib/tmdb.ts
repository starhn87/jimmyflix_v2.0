import 'server-only'

import { cache } from 'react'
import { getDictionary } from '@/lib/dictionaries'
import { tmdbLanguage, type Locale } from '@/lib/i18n'
import { runCatalogSearch } from '@/lib/search'
import type {
  CollectionDetail,
  MediaCredits,
  MediaDetail,
  MediaItem,
  MediaSectionData,
  MediaType,
  Keyword,
  PersonCredits,
  PersonDetail,
  PersonSearchResult,
  TimeWindow,
  TmdbListResponse,
  WatchProviderRegion,
  WatchProviderResponse,
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

const getDiscoverList = async (
  mediaType: MediaType,
  query: Record<string, QueryValue>,
  locale: Locale,
) => {
  const response = await tmdbFetch<TmdbListResponse<MediaItem>>(
    `discover/${mediaType}`,
    { include_adult: false, ...query },
    { locale },
  )
  return response.results
}

interface LocalizedSpotlight {
  value: string | number
  name: Record<Locale, string>
}

const countrySpotlights: LocalizedSpotlight[] = [
  { value: 'KR', name: { en: 'South Korea', ko: '한국' } },
  { value: 'JP', name: { en: 'Japan', ko: '일본' } },
  { value: 'FR', name: { en: 'France', ko: '프랑스' } },
  { value: 'IN', name: { en: 'India', ko: '인도' } },
  { value: 'ES', name: { en: 'Spain', ko: '스페인' } },
  { value: 'BR', name: { en: 'Brazil', ko: '브라질' } },
]

const movieGenreSpotlights: LocalizedSpotlight[] = [
  { value: 99, name: { en: 'Documentary', ko: '다큐멘터리' } },
  { value: 16, name: { en: 'Animation', ko: '애니메이션' } },
  { value: 80, name: { en: 'Crime', ko: '범죄' } },
  { value: 10402, name: { en: 'Music', ko: '음악' } },
  { value: 878, name: { en: 'Science fiction', ko: 'SF' } },
  { value: 36, name: { en: 'History', ko: '역사' } },
]

const tvGenreSpotlights: LocalizedSpotlight[] = [
  { value: 99, name: { en: 'Documentary', ko: '다큐멘터리' } },
  { value: 16, name: { en: 'Animation', ko: '애니메이션' } },
  { value: 80, name: { en: 'Crime', ko: '범죄' } },
  { value: 9648, name: { en: 'Mystery', ko: '미스터리' } },
  { value: 10765, name: { en: 'Sci-fi & fantasy', ko: 'SF·판타지' } },
  { value: 10768, name: { en: 'War & politics', ko: '전쟁·정치' } },
]

export const getDailyRotationIndex = (itemCount: number, cadenceDays = 1) => {
  if (itemCount <= 0) return 0
  const day = Math.floor(Date.now() / 86_400_000)
  return Math.floor(day / cadenceDays) % itemCount
}

const getRotatingSpotlight = <T,>(items: T[], cadenceDays = 1) =>
  items[getDailyRotationIndex(items.length, cadenceDays)]

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
  const dictionary = getDictionary(locale).sections
  const [nowPlaying, topRated, upcoming] = dictionary.movie
  const country = getRotatingSpotlight(countrySpotlights, 7)
  const genre = getRotatingSpotlight(movieGenreSpotlights)
  const countryName = country.name[locale]
  const genreName = genre.name[locale]

  return createSectionRequests([
    {
      ...nowPlaying,
      mediaType: 'movie',
      load: () => getList('movie/now_playing', locale),
    },
    {
      id: 'hidden-gem-movies',
      title: dictionary.hiddenGemMovies,
      description: dictionary.hiddenGemMoviesDescription,
      mediaType: 'movie',
      load: () => getDiscoverList('movie', {
        sort_by: 'vote_average.desc',
        'vote_average.gte': 7,
        'vote_count.gte': 300,
        'vote_count.lte': 5000,
      }, locale),
    },
    {
      id: 'short-movies',
      title: dictionary.shortMovies,
      description: dictionary.shortMoviesDescription,
      mediaType: 'movie',
      load: () => getDiscoverList('movie', {
        sort_by: 'popularity.desc',
        'vote_average.gte': 6.5,
        'vote_count.gte': 300,
        'with_runtime.lte': 100,
      }, locale),
    },
    {
      id: `movies-from-${String(country.value).toLowerCase()}`,
      title: dictionary.countrySpotlight(countryName),
      description: dictionary.countrySpotlightDescription(countryName),
      mediaType: 'movie',
      load: () => getDiscoverList('movie', {
        sort_by: 'popularity.desc',
        'vote_count.gte': 50,
        with_origin_country: country.value,
      }, locale),
    },
    {
      id: `movie-genre-${genre.value}`,
      title: dictionary.genreSpotlight(genreName),
      description: dictionary.genreSpotlightDescription(genreName),
      mediaType: 'movie',
      load: () => getDiscoverList('movie', {
        sort_by: 'popularity.desc',
        'vote_average.gte': 6,
        'vote_count.gte': 100,
        with_genres: genre.value,
      }, locale),
    },
    {
      ...topRated,
      mediaType: 'movie',
      load: () => getList('movie/top_rated', locale),
    },
    {
      ...upcoming,
      mediaType: 'movie',
      load: () => getList('movie/upcoming', locale),
    },
  ])
}

export const getTvSectionRequests = (locale: Locale) => {
  const dictionary = getDictionary(locale).sections
  const [topRated, , onTheAir, airingToday] = dictionary.tv
  const country = getRotatingSpotlight(countrySpotlights, 7)
  const genre = getRotatingSpotlight(tvGenreSpotlights)
  const countryName = country.name[locale]
  const genreName = genre.name[locale]

  return createSectionRequests([
    {
      ...onTheAir,
      mediaType: 'tv',
      load: () => getList('tv/on_the_air', locale),
    },
    {
      id: 'hidden-gem-shows',
      title: dictionary.hiddenGemShows,
      description: dictionary.hiddenGemShowsDescription,
      mediaType: 'tv',
      load: () => getDiscoverList('tv', {
        sort_by: 'vote_average.desc',
        'vote_average.gte': 7.5,
        'vote_count.gte': 100,
        'vote_count.lte': 2500,
      }, locale),
    },
    {
      id: 'miniseries',
      title: dictionary.miniseries,
      description: dictionary.miniseriesDescription,
      mediaType: 'tv',
      load: () => getDiscoverList('tv', {
        sort_by: 'popularity.desc',
        'vote_average.gte': 6.5,
        'vote_count.gte': 100,
        with_type: 2,
      }, locale),
    },
    {
      id: `shows-from-${String(country.value).toLowerCase()}`,
      title: dictionary.countrySpotlight(countryName),
      description: dictionary.countrySpotlightDescription(countryName),
      mediaType: 'tv',
      load: () => getDiscoverList('tv', {
        sort_by: 'popularity.desc',
        'vote_count.gte': 30,
        with_origin_country: country.value,
      }, locale),
    },
    {
      id: `tv-genre-${genre.value}`,
      title: dictionary.genreSpotlight(genreName),
      description: dictionary.genreSpotlightDescription(genreName),
      mediaType: 'tv',
      load: () => getDiscoverList('tv', {
        sort_by: 'popularity.desc',
        'vote_average.gte': 6,
        'vote_count.gte': 75,
        with_genres: genre.value,
      }, locale),
    },
    {
      ...topRated,
      mediaType: 'tv',
      load: () => getList('tv/top_rated', locale),
    },
    {
      ...airingToday,
      mediaType: 'tv',
      load: () => getList('tv/airing_today', locale),
    },
  ])
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
  return tmdbFetch<MediaCredits>(
    `${mediaType}/${id}/credits`,
    {},
    { locale },
  )
})

export const getCollection = cache(async (id: number, locale: Locale) => {
  const response = await tmdbFetch<CollectionDetail>(`collection/${id}`, {}, { locale })
  return response.parts
})

export const getRelatedTitles = cache(async (
  mediaType: MediaType,
  id: number,
  locale: Locale,
) => {
  const requests = await Promise.allSettled([
    getList(`${mediaType}/${id}/recommendations`, locale),
    getList(`${mediaType}/${id}/similar`, locale),
  ])
  const seen = new Set<number>([id])

  return requests.flatMap((result) => result.status === 'fulfilled' ? result.value : [])
    .filter((item) => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
    .slice(0, 20)
})

export const getWatchProviders = cache(async (
  mediaType: MediaType,
  id: number,
  locale: Locale,
): Promise<WatchProviderRegion | null> => {
  const response = await tmdbFetch<WatchProviderResponse>(
    `${mediaType}/${id}/watch/providers`,
    {},
    { locale },
  )
  const region = locale === 'ko' ? 'KR' : 'US'
  return response.results[region] || null
})

export const getPersonDetail = cache((id: number, locale: Locale) =>
  tmdbFetch<PersonDetail>(
    `person/${id}`,
    { append_to_response: 'combined_credits' },
    { locale },
  ),
)
