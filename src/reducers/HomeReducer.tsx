import { FAIL, SUCCESS } from "../actions"

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

const homeReducer = (state: HomeState, action: HomeAction): HomeState => {
    switch (action.type) {
        case SUCCESS:
            return {
                ...state,
                nowPlaying: action.payload ? action.payload.nowPlaying : null,
                upcoming: action.payload ? action.payload.upcoming : null,
                popular: action.payload ? action.payload.popular : null,
                loading: false
            }

        case FAIL:
            return {
                ...state,
                error: "Can't find Home information.",
                loading: false
            }

        default:
            throw new Error("Unhandled Home Action.");
    }
}

export default homeReducer;