import 'server-only'

import { cache } from 'react'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import type { MediaItem, MediaType, TmdbListResponse } from '@/types/tmdb'
import { tmdbFetch, type QueryValue } from '@/lib/tmdb/client'
import { createSectionRequests } from '@/lib/tmdb/sections'
import { getList, getRegionalMovieList, getDiscoverList } from '@/lib/tmdb/lists'

export const getCatalogFeaturedItem = cache(async (mediaType: MediaType, locale: Locale) => {
  try {
    // Share the first catalog fetch; the hero does not need to wait for page two.
    const response = await tmdbFetch<TmdbListResponse<MediaItem>>(
      mediaType === 'movie' ? 'movie/now_playing' : 'tv/on_the_air',
      { ...(mediaType === 'movie' ? { region: locale === 'ko' ? 'KR' : 'US' } : {}), page: 1 },
      { locale },
    )
    const candidates = response.results.filter((item) => item.backdrop_path).slice(0, 12)
    return candidates[getDailyRotationIndex(candidates.length)] || null
  } catch {
    return null
  }
})
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
export const getDailyRotationIndex = (itemCount: number, cadenceDays = 1) => {
  if (itemCount <= 0) return 0
  const day = Math.floor(Date.now() / 86_400_000)
  return Math.floor(day / cadenceDays) % itemCount
}

const getRotatingSpotlight = <T,>(items: T[], cadenceDays = 1) =>
  items[getDailyRotationIndex(items.length, cadenceDays)]

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

  const result = await getDiscoverList('movie', {
    sort_by: 'popularity.desc',
    region: locale === 'ko' ? 'KR' : 'US',
    with_release_type: '2|3',
    'release_date.gte': from,
    'release_date.lte': to,
  }, locale)

  const items = result.items
    .filter(({ release_date }) => release_date && release_date >= from && release_date <= to)
    .sort((left, right) => {
      const dateOrder = String(left.release_date).localeCompare(String(right.release_date))
      return dateOrder || Number(right.popularity || 0) - Number(left.popularity || 0)
    })
  return { ...result, items }
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
