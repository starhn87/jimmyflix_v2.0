import { createSlice } from '@reduxjs/toolkit'
import { DetailState } from '../../interface'

export const detailInitialState: DetailState = {
  result: null,
  casts: null,
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
      casts: null,
    }),
    fail: (state) => ({
      ...state,
      result: null,
      casts: null,
      error: "Can't find Detail information.",
    }),
    reset: () => detailInitialState,
    tab: (state, action) => ({
      ...state,
      tabName: action.payload,
    }),
    cast: (state, action) => ({
      ...state,
      casts: action.payload.casts,
    }),
  },
})

export const { success, fail, reset, tab, cast } = detail.actions

export default detail.reducer
