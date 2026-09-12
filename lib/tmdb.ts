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
  SeasonDetail,
  StreamingDiscoveryData,
  WatchProvider,
  WatchProviderListResponse,
  WatchProviderRegion,
  WatchProviderResponse,
  Video,
} from '@/types/tmdb'

const API_BASE_URL = 'https://api.themoviedb.org/3/'
const DEFAULT_REVALIDATE_SECONDS = 60 * 30
const CATALOG_ITEM_LIMIT = 40
const CATALOG_PAGE_COUNT = Math.ceil(CATALOG_ITEM_LIMIT / 20)

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

const getPagedMediaItems = async (
  path: string,
  query: Record<string, QueryValue>,
  options: TmdbFetchOptions,
) => {
  const pages = await Promise.allSettled(
    Array.from({ length: CATALOG_PAGE_COUNT }, (_, index) => tmdbFetch<TmdbListResponse<MediaItem>>(
      path,
      { ...query, page: index + 1 },
      options,
    )),
  )

  if (pages[0].status === 'rejected') throw pages[0].reason

  const seen = new Set<number>()
  return pages
    .flatMap((page) => page.status === 'fulfilled' ? page.value.results : [])
    .filter((item) => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
    .slice(0, CATALOG_ITEM_LIMIT)
}

const getList = (path: string, locale: Locale, revalidate?: number) =>
  getPagedMediaItems(path, {}, { revalidate, locale })

const getRegionalMovieList = (path: string, locale: Locale) =>
  getPagedMediaItems(
    path,
    { region: locale === 'ko' ? 'KR' : 'US' },
    { locale },
  )

const getDiscoverList = async (
  mediaType: MediaType,
  query: Record<string, QueryValue>,
  locale: Locale,
) => {
  return getPagedMediaItems(
    `discover/${mediaType}`,
    { include_adult: false, ...query },
    { locale },
  )
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

const tvGenreSpotlights: LocalizedSpotlight[] = [
  { value: 99, name: { en: 'Documentary', ko: '다큐멘터리' } },
  { value: 16, name: { en: 'Animation', ko: '애니메이션' } },
  { value: 80, name: { en: 'Crime', ko: '범죄' } },
  { value: 9648, name: { en: 'Mystery', ko: '미스터리' } },
  { value: 10765, name: { en: 'Sci-fi & fantasy', ko: 'SF·판타지' } },
  { value: 10768, name: { en: 'War & politics', ko: '전쟁·정치' } },
]

const movieThemeSpotlights: LocalizedSpotlight[] = [
  { value: 4379, name: { en: 'Time travel', ko: '시간 여행' } },
  { value: 10051, name: { en: 'Heist stories', ko: '하이스트' } },
  { value: 10683, name: { en: 'Coming of age', ko: '성장 이야기' } },
  { value: 10349, name: { en: 'Survival', ko: '생존' } },
  { value: 3801, name: { en: 'Space travel', ko: '우주 여행' } },
  { value: 33519, name: { en: 'Courtroom drama', ko: '법정 드라마' } },
  { value: 248927, name: { en: 'Found family', ko: '선택한 가족' } },
]

interface DiscoverySpotlight {
  id: string
  name: Record<Locale, string>
  query: (locale: Locale) => Record<string, QueryValue>
}

const movieLensSpotlights: DiscoverySpotlight[] = [
  {
    id: 'family-night',
    name: { en: 'Family movie night', ko: '온 가족 영화' },
    query: (locale) => ({
      sort_by: 'popularity.desc',
      'vote_average.gte': 6,
      'vote_count.gte': 100,
      region: locale === 'ko' ? 'KR' : 'US',
      certification_country: locale === 'ko' ? 'KR' : 'US',
      certification: locale === 'ko' ? 'ALL' : 'G|PG',
    }),
  },
  ...[
    ['1980s', '1980-01-01', '1989-12-31', '1980년대'],
    ['1990s', '1990-01-01', '1999-12-31', '1990년대'],
    ['2000s', '2000-01-01', '2009-12-31', '2000년대'],
    ['2010s', '2010-01-01', '2019-12-31', '2010년대'],
  ].map(([id, from, to, koreanName]) => ({
    id,
    name: { en: `${id} favorites`, ko: `${koreanName} 명작` },
    query: () => ({
      sort_by: 'vote_average.desc',
      'vote_average.gte': 7,
      'vote_count.gte': 500,
      'primary_release_date.gte': from,
      'primary_release_date.lte': to,
    }),
  })),
]

const tvFormatSpotlights: DiscoverySpotlight[] = [
  {
    id: 'reality-tv',
    name: { en: 'Reality TV', ko: '리얼리티' },
    query: () => ({
      sort_by: 'popularity.desc',
      'vote_average.gte': 6,
      'vote_count.gte': 30,
      with_type: 3,
    }),
  },
  {
    id: 'talk-shows',
    name: { en: 'Talk shows', ko: '토크쇼' },
    query: () => ({
      sort_by: 'popularity.desc',
      'vote_average.gte': 6,
      'vote_count.gte': 20,
      with_type: 5,
    }),
  },
  {
    id: 'completed-series',
    name: { en: 'Completed series', ko: '완결 시리즈' },
    query: () => ({
      sort_by: 'vote_average.desc',
      'vote_average.gte': 7,
      'vote_count.gte': 100,
      with_status: 3,
    }),
  },
]

const preferredProviderIds: Record<Locale, Record<MediaType, number[]>> = {
  ko: {
    movie: [8, 337, 356, 97, 119],
    tv: [8, 337, 356, 97, 119],
  },
  en: {
    movie: [8, 337, 15, 9, 350],
    tv: [8, 337, 15, 9, 350],
  },
}

const providerFallbacks: Record<number, Pick<WatchProvider, 'provider_id' | 'provider_name' | 'logo_path' | 'display_priority'>> = {
  8: { provider_id: 8, provider_name: 'Netflix', logo_path: null, display_priority: 0 },
  9: { provider_id: 9, provider_name: 'Prime Video', logo_path: null, display_priority: 0 },
  15: { provider_id: 15, provider_name: 'Hulu', logo_path: null, display_priority: 0 },
  97: { provider_id: 97, provider_name: 'Watcha', logo_path: null, display_priority: 0 },
  119: { provider_id: 119, provider_name: 'Prime Video', logo_path: null, display_priority: 0 },
  337: { provider_id: 337, provider_name: 'Disney+', logo_path: null, display_priority: 0 },
  350: { provider_id: 350, provider_name: 'Apple TV+', logo_path: null, display_priority: 0 },
  356: { provider_id: 356, provider_name: 'Wavve', logo_path: null, display_priority: 0 },
}

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

const getRegionalReleaseCalendar = async (locale: Locale) => {
  const timeZone = locale === 'ko' ? 'Asia/Seoul' : 'America/New_York'
  const dateParts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const dateValues = Object.fromEntries(dateParts.map(({ type, value }) => [type, value]))
  const today = new Date(Date.UTC(
    Number(dateValues.year),
    Number(dateValues.month) - 1,
    Number(dateValues.day),
  ))
  const start = new Date(today)
  const end = new Date(today)
  start.setUTCDate(start.getUTCDate() + 1)
  end.setUTCDate(end.getUTCDate() + 45)
  const from = start.toISOString().slice(0, 10)
  const to = end.toISOString().slice(0, 10)

  const items = await getDiscoverList('movie', {
    sort_by: 'popularity.desc',
    region: locale === 'ko' ? 'KR' : 'US',
    with_release_type: '2|3',
    'release_date.gte': from,
    'release_date.lte': to,
  }, locale)

  return items
    .filter(({ release_date }) => release_date && release_date >= from && release_date <= to)
    .sort((left, right) => {
      const dateOrder = String(left.release_date).localeCompare(String(right.release_date))
      return dateOrder || Number(right.popularity || 0) - Number(left.popularity || 0)
    })
}

export const getMovieSectionRequests = (locale: Locale) => {
  const dictionary = getDictionary(locale).sections
  const [nowPlaying, , upcoming] = dictionary.movie
  const country = getRotatingSpotlight(countrySpotlights, 7)
  const theme = getRotatingSpotlight(movieThemeSpotlights)
  const lens = getRotatingSpotlight(movieLensSpotlights, 7)
  const countryName = country.name[locale]
  const themeName = theme.name[locale]
  const lensName = lens.name[locale]

  return createSectionRequests([
    {
      ...nowPlaying,
      mediaType: 'movie',
      load: () => getRegionalMovieList('movie/now_playing', locale),
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
      id: `movie-theme-${theme.value}`,
      title: dictionary.themeSpotlight(themeName),
      description: dictionary.themeSpotlightDescription(themeName),
      mediaType: 'movie',
      load: () => getDiscoverList('movie', {
        sort_by: 'popularity.desc',
        'vote_average.gte': 6.5,
        'vote_count.gte': 200,
        with_keywords: theme.value,
      }, locale),
    },
    {
      id: `movie-lens-${lens.id}`,
      title: dictionary.movieLensSpotlight(lensName),
      description: dictionary.movieLensSpotlightDescription(lensName),
      mediaType: 'movie',
      load: () => getDiscoverList('movie', lens.query(locale), locale),
    },
    {
      ...upcoming,
      description: dictionary.releaseCalendarDescription,
      mediaType: 'movie',
      load: () => getRegionalReleaseCalendar(locale),
    },
  ])
}

export const getTvSectionRequests = (locale: Locale) => {
  const dictionary = getDictionary(locale).sections
  const [, , onTheAir, airingToday] = dictionary.tv
  const country = getRotatingSpotlight(countrySpotlights, 7)
  const genre = getRotatingSpotlight(tvGenreSpotlights)
  const format = getRotatingSpotlight(tvFormatSpotlights, 7)
  const countryName = country.name[locale]
  const genreName = genre.name[locale]
  const formatName = format.name[locale]

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
      id: `tv-format-${format.id}`,
      title: dictionary.tvFormatSpotlight(formatName),
      description: dictionary.tvFormatSpotlightDescription(formatName),
      mediaType: 'tv',
      load: () => getDiscoverList('tv', format.query(locale), locale),
    },
    {
      ...airingToday,
      mediaType: 'tv',
      load: () => getList('tv/airing_today', locale),
    },
  ])
}

const getPreferredProviders = async (mediaType: MediaType, locale: Locale) => {
  const ids = preferredProviderIds[locale][mediaType]
  let availableProviders: WatchProvider[] = []

  try {
    const response = await tmdbFetch<WatchProviderListResponse>(
      `watch/providers/${mediaType}`,
      { watch_region: locale === 'ko' ? 'KR' : 'US' },
      { locale, revalidate: 60 * 60 * 24 },
    )
    availableProviders = response.results
  } catch {
    // Keep the selector usable if provider metadata is temporarily unavailable.
  }

  return ids.map((id) => (
    availableProviders.find((provider) => provider.provider_id === id) || providerFallbacks[id]
  )).filter((provider): provider is WatchProvider => Boolean(provider))
}

export const getStreamingDiscovery = async (
  mediaType: MediaType,
  requestedProviderId: number | null,
  locale: Locale,
): Promise<StreamingDiscoveryData> => {
  const dictionary = getDictionary(locale).sections
  const preferredIds = preferredProviderIds[locale][mediaType]
  const selectedProviderId = requestedProviderId && preferredIds.includes(requestedProviderId)
    ? requestedProviderId
    : preferredIds[0]
  const providersRequest = getPreferredProviders(mediaType, locale)
  const titlesRequest = getDiscoverList(mediaType, {
    sort_by: 'popularity.desc',
    'vote_count.gte': mediaType === 'movie' ? 50 : 25,
    watch_region: locale === 'ko' ? 'KR' : 'US',
    with_watch_providers: selectedProviderId,
    with_watch_monetization_types: 'flatrate',
  }, locale)
  const [providersResult, titlesResult] = await Promise.allSettled([
    providersRequest,
    titlesRequest,
  ])
  const providers = providersResult.status === 'fulfilled'
    ? providersResult.value
    : preferredIds.map((id) => providerFallbacks[id]).filter(Boolean)
  const selected = providers.find((provider) => provider.provider_id === selectedProviderId) || providers[0]
  const mediaLabel = mediaType === 'movie'
    ? dictionary.streamingMovies
    : dictionary.streamingShows
  const section: MediaSectionData = {
    id: `streaming-${mediaType}`,
    title: mediaLabel(selected.provider_name),
    description: '',
    mediaType,
    items: titlesResult.status === 'fulfilled' ? titlesResult.value : [],
    error: titlesResult.status === 'rejected',
  }

  return {
    section,
    selectedProviderId,
    providers: providers.map((provider) => ({
      ...provider,
      selected: provider.provider_id === selectedProviderId,
    })),
  }
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

const getMediaDetail = async (mediaType: MediaType, id: number, locale: Locale) => {
  const detailRequest = tmdbFetch<MediaDetail>(`${mediaType}/${id}`, {
    append_to_response: 'videos,images,keywords',
    include_image_language: locale === 'ko' ? 'ko,en,null' : 'en,null',
  }, { locale })
  const englishVideosRequest = locale === 'ko'
    ? tmdbFetch<{ results: Video[] }>(`${mediaType}/${id}/videos`, {}, { locale: 'en' })
      .catch(() => null)
    : Promise.resolve(null)
  const [detail, englishVideos] = await Promise.all([detailRequest, englishVideosRequest])
  const seenVideos = new Set<string>()
  const videos = [
    ...(detail.videos?.results || []),
    ...(englishVideos?.results || []),
  ].filter((video) => {
    if (seenVideos.has(video.id)) return false
    seenVideos.add(video.id)
    return true
  })

  return {
    ...detail,
    videos: { results: videos },
  }
}

export const getMovieDetail = cache((id: number, locale: Locale) =>
  getMediaDetail('movie', id, locale),
)

export const getTvDetail = cache((id: number, locale: Locale) =>
  getMediaDetail('tv', id, locale),
)

export const getTvSeasonDetail = cache((
  id: number,
  seasonNumber: number,
  locale: Locale,
) => tmdbFetch<SeasonDetail>(`tv/${id}/season/${seasonNumber}`, {}, { locale }))

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
    .slice(0, CATALOG_ITEM_LIMIT)
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
