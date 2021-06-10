import { createSlice } from "@reduxjs/toolkit";

export interface TVState {
    topRated: [] | null,
    popular: [] | null,
    airingToday: [] | null,
    error: string | null,
    loading: boolean
}

export const tvInitialState: TVState = {
    topRated: null,
    popular: null,
    airingToday: null,
    error: null,
    loading: true
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
            loading: false
        }),
        fail: (state) => ({
            ...state,
            error: "Can't find TV information.",
            loading: false
        }),
        reset: () => tvInitialState
    }
})

export const { success, fail, reset } = tv.actions;
export default tv.reducer;