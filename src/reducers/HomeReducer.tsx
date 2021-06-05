import { createSlice } from "@reduxjs/toolkit"

export interface HomeState {
    nowPlaying: [] | null,
    upcoming: [] | null,
    popular: [] | null,
    error: string | null,
    loading: boolean
}

export interface HomeAction {
    type: string,
    payload?: {
        nowPlaying: [],
        upcoming: [],
        popular: [],
    }
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
                nowPlaying: action.payload ? action.payload.nowPlaying : null,
                upcoming: action.payload ? action.payload.upcoming : null,
                popular: action.payload ? action.payload.popular : null,
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




