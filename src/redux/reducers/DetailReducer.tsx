import { createSlice } from '@reduxjs/toolkit'

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
  cast: [] | null
  error: string | null
  tabName: string
}

export const detailInitialState: DetailState = {
  result: null,
  cast: null,
  error: null,
  tabName: 'Trailer',
}

const detail = createSlice({
  name: 'detailReducer',
  initialState: detailInitialState,
  reducers: {
    success: (state, action) => ({
      ...state,
      error: null,
      result: action.payload.results,
      cast: null,
    }),
    fail: (state) => ({
      ...state,
      result: null,
      cast: null,
      error: "Can't find Detail information.",
    }),
    reset: () => detailInitialState,
    tab: (state, action) => ({
      ...state,
      tabName: action.payload,
    }),
    cast: (state, action) => ({
      ...state,
      cast: action.payload.casts,
    }),
  },
})

export const { success, fail, reset, tab, cast } = detail.actions

export default detail.reducer
