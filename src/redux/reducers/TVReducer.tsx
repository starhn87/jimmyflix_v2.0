import { createSlice } from '@reduxjs/toolkit'
import { TVState } from '../../interface'

export const tvInitialState: TVState = {
  topRated: null,
  popular: null,
  airingToday: null,
  error: null,
}

const tv = createSlice({
  name: 'tvReducer',
  initialState: tvInitialState,
  reducers: {
    success: (state, action) => ({
      ...state,
      topRated: action.payload.topRated,
      airingToday: action.payload.airingToday,
      popular: action.payload.popular,
    }),
    fail: (state) => ({
      ...state,
      error: "Can't find TV information.",
    }),
    reset: () => tvInitialState,
  },
})

export const { success, fail, reset } = tv.actions
export default tv.reducer
