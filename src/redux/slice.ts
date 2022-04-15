import { createSlice } from '@reduxjs/toolkit'
import { IState } from '../interface'

export const searchInitialState: IState = {
  isSearched: false,
  searchValue: '',
  timeType: 'Day',
}

export const search = createSlice({
  name: 'searchReducer',
  initialState: searchInitialState,
  reducers: {
    searched: (state, action) => ({
      ...state,
      searchValue: action.payload,
      isSearched: true,
    }),
    timeType: (state, action) => ({
      ...state,
      timeType: action.payload,
    }),
    reset: () => searchInitialState,
  },
})

export const { searched, timeType, reset } = search.actions

export default search.reducer
