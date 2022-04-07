export interface IMovie {
  id: number
  poster_path: string
  title: string
  vote_average: number
  release_date: string
}

export interface IShow {
  id: number
  poster_path: string
  name: string
  vote_average: number
  first_air_date: string
}

export interface ISearchState {
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

export type TabType =
  | 'Trailer'
  | 'Season'
  | 'Credits'
  | 'Production'
  | 'Collection'