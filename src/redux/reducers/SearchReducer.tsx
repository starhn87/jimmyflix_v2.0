import { createSlice } from '@reduxjs/toolkit'

export interface SearchState {
  movieResults: [] | null
  tvResults: [] | null
  error: string | null
  isSearched: boolean
}

export const searchInitialState: SearchState = {
  movieResults: null,
  tvResults: null,
  error: null,
  isSearched: false,
}

export const search = createSlice({
  name: 'searchReducer',
  initialState: searchInitialState,
  reducers: {
    success: (state, action) => ({
      ...state,
      movieResults: action.payload.movieResults,
      tvResults: action.payload.tvResults,
      isSearched: true,
    }),
    fail: (state) => ({
      ...state,
      error: "Can't find Search results.",
      isSearched: true,
    }),
    reset: () => searchInitialState,
  },
})

export const { success, fail, reset } = search.actions

export default search.reducer
