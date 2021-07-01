import { createSlice } from "@reduxjs/toolkit";

export interface DetailState {
    result: {
        imdb_id: number,
        backdrop_path: string,
        title: string,
        name: string,
        poster_path: string,
        release_date: string,
        first_air_date: string,
        runtime?: number,
        episode_run_time: string,
        genres: [],
        overview: string,
        belongs_to_collection: {
            id: number
        },
        seasons: [],
        video: boolean,
        videos: {
            results: []
        },
        production_companies: [],
        production_countries: [],
        vote_average: number
    } | null,
    error: string | null,
    loading: boolean,
    tabName: string
}

export const detailInitialState: DetailState = {
    result: null,
    error: null,
    loading: true,
    tabName: 'Trailer'
};

const detail = createSlice({
    name: 'detailReducer',
    initialState: detailInitialState,
    reducers: {
        success: (state, action) => ({
            ...state,
            error: null,
            result: action.payload.results,
            loading: false
        }),
        fail: (state) => ({
            ...state,
            result: null,
            error: "Can't find Detail information.",
            loading: false
        }),
        reset: () => detailInitialState,
        tab: (state, action) => ({
            ...state,
            tabName: action.payload
        })
    }
})

export const { success, fail, reset, tab } = detail.actions;

export default detail.reducer;


