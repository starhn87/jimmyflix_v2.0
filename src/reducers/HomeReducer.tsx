import { createSlice } from "@reduxjs/toolkit"

export interface HomeState {
    nowPlaying: [] | null,
    upcoming: [] | null,
    popular: [] | null,
    error: string | null,
    loading: boolean
}

export const homeInitialState: HomeState = {
    nowPlaying: null,
    upcoming: null,
    popular: null,
    error: null,
    loading: true
}

const home = createSlice({
    name: 'homeReducer',
    initialState: homeInitialState,
    reducers: {
        success: (state, action) => {
            console.log(action.payload);
            return {
                ...state,
                nowPlaying: action.payload.nowPlaying,
                upcoming: action.payload.upcoming,
                popular: action.payload.popular,
                loading: false
            }
        },
        fail: (state) => {
            return {
                ...state,
                error: "Can't find Home Information.",
                loading: false
            }
        }
    }
})

export const { success, fail } = home.actions;
export default home.reducer;




