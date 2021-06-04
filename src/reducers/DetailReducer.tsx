import { FAIL, SUCCESS } from "../actions";

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

export interface DetailAction {
    type: string,
    payload?: {
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

    }
}

export const detailInitialState: DetailState = {
    result: null,
    error: null,
    loading: true
};

const detailReducer = (state: DetailState, action: DetailAction): DetailState => {
    switch (action.type) {
        case SUCCESS:
            return {
                ...state,
                result: action.payload ? action.payload : null,
                loading: false
            }
        case FAIL:
            return {
                result: null,
                error: "Can't find Detail information.",
                loading: false,
            }
        default:
            throw new Error("Unhandled Detail Action.");
    }
}

export default detailReducer;






