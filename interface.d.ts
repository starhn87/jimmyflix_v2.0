import 'react'

declare module 'react' {
  export type FC<P = {}> = FunctionComponent<P>
  export interface FunctionComponent<P = {}> {
    (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null
    propTypes?: WeakValidationMap<P> | undefined
    contextTypes?: ValidationMap<any> | undefined
    defaultProps?: Partial<P> | undefined
    displayName?: string | undefined
  }
}

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

export interface IContent extends IMovie, IShow {}

export interface IState {
  isSearched: boolean
  searchValue: string
  timeType: TimeType
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

export interface IProfile {
  id: number
  profile_path: string
  original_name: string
  character: string
}

export interface ICompany {
  id: number
  logo_path: string
  name: string
}

export interface ICountry {
  name: string
  iso_3166_1: string
}

export interface ISeason {
  id: number
  poster_path: string
  name: string
}

export interface IPerson {
  id: number
  name: string
  profile_path: string
}

export type TabType =
  | 'Trailer'
  | 'Season'
  | 'Credits'
  | 'Production'
  | 'Collection'

export type TimeType = 'Day' | 'Week'
