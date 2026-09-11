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
  adult?: boolean
  popularity?: number
}

export interface PersonSearchResult {
  id: number
  name: string
  adult?: boolean
  known_for: MediaItem[]
}

export interface Keyword {
  id: number
  name: string
}

export interface PersonCredits {
  cast: MediaItem[]
  crew: MediaItem[]
}

export interface PersonCredit extends MediaItem {
  character?: string
  job?: string
  department?: string
}

export interface PersonDetail {
  id: number
  name: string
  biography: string
  birthday: string | null
  deathday: string | null
  place_of_birth: string | null
  profile_path: string | null
  known_for_department: string
  also_known_as: string[]
  imdb_id?: string | null
  combined_credits?: {
    cast: PersonCredit[]
    crew: PersonCredit[]
  }
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

export interface CrewMember {
  id: number
  name: string
  original_name?: string
  job: string
  department: string
  profile_path: string | null
}

export interface MediaCredits {
  cast: CastMember[]
  crew: CrewMember[]
}

export interface WatchProvider {
  provider_id: number
  provider_name: string
  logo_path: string | null
  display_priority: number
}

export interface WatchProviderRegion {
  link: string
  flatrate?: WatchProvider[]
  free?: WatchProvider[]
  ads?: WatchProvider[]
  rent?: WatchProvider[]
  buy?: WatchProvider[]
}

export interface WatchProviderResponse {
  id: number
  results: Record<string, WatchProviderRegion>
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
