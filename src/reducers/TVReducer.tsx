import { FAIL, SUCCESS } from "../actions"

export interface TVState {
    topRated: [] | null,
    popular: [] | null,
    airingToday: [] | null,
    error: string | null,
    loading: boolean
}

export interface TVAction {
    type: string,
    payload?: {
        topRated: [],
        airingToday: [],
        popular: []
    }
}

export const tvInitialState: TVState = {
    topRated: null,
    popular: null,
    airingToday: null,
    error: null,
    loading: true
}

const tvReducer = (state: TVState, action: TVAction): TVState => {
    switch (action.type) {
        case SUCCESS:
            return {
                ...state,
                topRated: action.payload ? action.payload.topRated : null,
                airingToday: action.payload ? action.payload.airingToday : null,
                popular: action.payload ? action.payload.popular : null,
                loading: false
            }

        case FAIL:
            return {
                ...state,
                error: "Can't find TV information.",
                loading: false
            }

        default:
            throw new Error("Unhandled TV Action.");
    }
}

export default tvReducer;