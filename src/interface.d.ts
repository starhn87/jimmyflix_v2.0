export interface Movie {
  id: number
  poster_path: string
  title: string
  vote_average: number
  release_date: string
}

export interface Show {
  id: number
  poster_path: string
  name: string
  vote_average: number
  first_air_date: string
}

export interface SearchState {
  isSearched: boolean
  value: string
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
