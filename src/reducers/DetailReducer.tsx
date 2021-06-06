import { createSlice } from "@reduxjs/toolkit";

export interface DetailState {
    result: {
        imdb_id: number,
        backdrop_path: string,
        original_title: string,
        original_name: string,
        poster_path: string,
        release_date: string,
        first_air_date: string,
        runtime?: number,
        episode_runtime: number,
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

    } | null,
    error: string | null,
    loading: boolean
}

export const detailInitialState: DetailState = {
    result: null,
    error: null,
    loading: true
};

const detail = createSlice({
    name: 'detailReducer',
    initialState: detailInitialState,
    reducers: {
        success: (state, action) => ({
            error: null,
            result: action.payload.results,
            loading: false
        }),
        fail: () => ({
            result: null,
            error: "Can't find Detail information.",
            loading: false
        }),
        reset: () => detailInitialState
    }
})

export const { success, fail, reset } = detail.actions;

export default detail.reducer;


