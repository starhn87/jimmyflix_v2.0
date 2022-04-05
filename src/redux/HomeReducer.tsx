import { createSlice } from '@reduxjs/toolkit'
import { HomeState } from '../interface'

export const homeInitialState: HomeState = {
  nowPlaying: null,
  upcoming: null,
  popular: null,
  error: null,
}

const home = createSlice({
  name: 'homeReducer',
  initialState: homeInitialState,
  reducers: {
    success: (state, action) => {
      return {
        ...state,
        nowPlaying: action.payload.nowPlaying,
        upcoming: action.payload.upcoming,
        popular: action.payload.popular,
      }
    },
    fail: (state) => {
      return {
        ...state,
        error: "Can't find Home Information.",
      }
    },
    reset: () => homeInitialState,
  },
})

export const { success, fail, reset } = home.actions
export default home.reducer
