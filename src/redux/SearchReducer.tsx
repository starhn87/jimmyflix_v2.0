import { createSlice } from '@reduxjs/toolkit'
import { SearchState } from '../interface'

export const searchInitialState: SearchState = {
  isSearched: false,
  value: '',
}

export const search = createSlice({
  name: 'searchReducer',
  initialState: searchInitialState,
  reducers: {
    searched: (_state, action) => ({
      value: action.payload,
      isSearched: true,
    }),
    reset: () => searchInitialState,
  },
})

export const { searched, reset } = search.actions

export default search.reducer
