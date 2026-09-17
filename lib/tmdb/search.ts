import 'server-only'

import { runCatalogSearch } from '@/lib/search'
import type { Locale } from '@/lib/i18n'
import type { Keyword, MediaItem, PersonCredits, PersonSearchResult, TmdbListResponse } from '@/types/tmdb'
import { tmdbFetch, CACHE_SECONDS } from '@/lib/tmdb/client'

const searchMovies = (query: string, locale: Locale) =>
  tmdbFetch<TmdbListResponse<MediaItem>>(
    'search/movie',
    { query: query.trim(), include_adult: false },
    { revalidate: CACHE_SECONDS.search, timeoutMs: 5000, locale },
  ).then((response) => response.results)

const searchTv = (query: string, locale: Locale) =>
  tmdbFetch<TmdbListResponse<MediaItem>>(
    'search/tv',
    { query: query.trim(), include_adult: false },
    { revalidate: CACHE_SECONDS.search, timeoutMs: 5000, locale },
  ).then((response) => response.results)

export const searchCatalog = (query: string, locale: Locale) => runCatalogSearch(query, {
  movies: (term) => searchMovies(term, locale),
  tv: (term) => searchTv(term, locale),
  people: (term) => tmdbFetch<TmdbListResponse<PersonSearchResult>>(
    'search/person',
    { query: term, include_adult: false },
    { revalidate: CACHE_SECONDS.search, timeoutMs: 5000, locale },
  ).then((response) => response.results),
  keywords: (term) => tmdbFetch<TmdbListResponse<Keyword>>(
    'search/keyword',
    { query: term },
    { revalidate: CACHE_SECONDS.search, timeoutMs: 5000, locale },
  ).then((response) => response.results),
  credits: (id) => tmdbFetch<PersonCredits>(
    `person/${id}/combined_credits`,
    {},
    { revalidate: CACHE_SECONDS.catalog, timeoutMs: 5000, locale },
  ),
  discover: (mediaType, keywordIds) => tmdbFetch<TmdbListResponse<MediaItem>>(
    `discover/${mediaType}`,
    { with_keywords: keywordIds.join('|'), include_adult: false, sort_by: 'popularity.desc' },
    { revalidate: CACHE_SECONDS.search, timeoutMs: 5000, locale },
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
