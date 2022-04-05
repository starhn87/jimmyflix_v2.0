export interface HomeState {
  nowPlaying: [] | null
  upcoming: [] | null
  popular: [] | null
  error: string | null
}

export interface DetailState {
  result: {
    imdb_id: number
    backdrop_path: string
    title: string
    name: string
    poster_path: string
    release_date: string
    first_air_date: string
    runtime?: number
    episode_run_time: number[]
    genres: []
    overview: string
    belongs_to_collection: {
      id: number
    }
    seasons: []
    video: boolean
    videos: {
      results: []
    }
    production_companies: []
    production_countries: []
    vote_average: number
  } | null
  casts: [] | null
  error: string | null
  tabName: string
}

export interface Movie {
  id: number
  poster_path: string
  title: string
  vote_average: number
  release_date: string
}

export interface SearchState {
  movieResults: [] | null
  tvResults: [] | null
  error: string | null
  isSearched: boolean
}

export interface TVState {
  topRated: [] | null
  popular: [] | null
  airingToday: [] | null
  error: string | null
}

export interface ICollection {
  id: number
  poster_path: string
  imageUrl: string
  title: string
  vote_average: number
  name: string
  release_date: string
}
