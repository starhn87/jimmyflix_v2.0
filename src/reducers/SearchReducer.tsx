import { FAIL, LOADING, SUCCESS } from "../actions";

export interface SearchState {
    movieResults: [] | null,
    tvResults: [] | null,
    error: string | null,
    loading: boolean | null
}

export interface SearchAction {
    type: string,
    payload?: {
        movieResults: [],
        tvResults: []
    }
}

export const searchInitialState: SearchState = {
    movieResults: null,
    tvResults: null,
    error: null,
    loading: null
};

const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
    switch (action.type) {
        case SUCCESS:
            return {
                ...state,
                movieResults: action.payload ? action.payload.movieResults : null,
                tvResults: action.payload ? action.payload.tvResults : null,
                loading: false
            }
        case FAIL:
            return {
                ...state,
                error: "Can't find Search results.",
                loading: false
            }
        case LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            throw new Error("Unhandled Search Action.");
    }
}

export default searchReducer;