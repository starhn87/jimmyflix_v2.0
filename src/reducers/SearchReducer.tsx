import { createSlice } from "@reduxjs/toolkit";

export interface SearchState {
    movieResults: [] | null,
    tvResults: [] | null,
    error: string | null,
    loading: boolean | null,
    searchTerm: string
}

export const searchInitialState: SearchState = {
    movieResults: null,
    tvResults: null,
    error: null,
    loading: null,
    searchTerm: ""
};


export const search = createSlice({
    name: 'searchReducer',
    initialState: searchInitialState,
    reducers: {
        success: (state, action) => ({
            ...state,
            movieResults: action.payload.movieResults,
            tvResults: action.payload.tvResults,
            loading: false
        }),
        fail: (state) => ({
            ...state,
            error: "Can't find Search results.",
            loading: false
        }),
        loading: (state) => ({
            ...state,
            loading: true
        }),
        term: (state, action) => ({
            ...state,
            searchTerm: action.payload
        }),
        reset: () => searchInitialState
    }
})

export const { success, fail, loading, term, reset } = search.actions;

export default search.reducer;