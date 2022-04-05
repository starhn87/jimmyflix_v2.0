import { createSlice } from '@reduxjs/toolkit'
<<<<<<< HEAD:src/redux/HomeReducer.tsx
import { HomeState } from '../interface'
=======

export interface HomeState {
  nowPlaying: [] | null
  upcoming: [] | null
  popular: [] | null
  error: string | null
}
>>>>>>> dev:src/redux/reducers/HomeReducer.tsx

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
