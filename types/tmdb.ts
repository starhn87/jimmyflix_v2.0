export type MediaType = 'movie' | 'tv'
export type TimeWindow = 'day' | 'week'

export interface MediaItem {
  id: number
  title?: string
  name?: string
  poster_path: string | null
  backdrop_path?: string | null
  overview?: string
  vote_average: number
  release_date?: string
  first_air_date?: string
  media_type?: MediaType | 'person'
}

export interface Genre {
  id: number
  name: string
}

export interface Video {
  id: string
  key: string
  name: string
  official?: boolean
  site: string
  type: string
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface Season {
  id: number
  name: string
  poster_path: string | null
  air_date?: string
  season_number: number
}

export interface CollectionSummary {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

export interface MediaDetail extends MediaItem {
  genres: Genre[]
  runtime?: number
  episode_run_time?: number[]
  imdb_id?: string | null
  videos?: {
    results: Video[]
  }
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  seasons?: Season[]
  belongs_to_collection?: CollectionSummary | null
}

export interface CastMember {
  id: number
  name: string
  original_name: string
  character?: string
  profile_path: string | null
  order?: number
}

export interface TmdbListResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface CollectionDetail {
  id: number
  name: string
  parts: MediaItem[]
}

export interface MediaSectionData {
  id: string
  title: string
  description: string
  mediaType: MediaType
  items: MediaItem[]
  error: boolean
}
