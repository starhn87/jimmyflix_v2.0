import React, { createContext, useContext, useReducer, useState } from "react";
import { FAIL, LOADING, SUCCESS } from "../actions";
import { moviesApi, tvApi } from "../api";
import searchReducer, { SearchState, SearchAction, searchInitialState } from "../reducers/SearchReducer";


const SearchContext = createContext<{
    state: SearchState,
    dispatch: React.Dispatch<SearchAction>,
    searchTerm: string,
    handleSubmit: (event: React.FormEvent) => void,
    updateTerm: (event: React.ChangeEvent<HTMLInputElement>) => void
}>({
    state: searchInitialState,
    dispatch: () => null,
    searchTerm: "",
    handleSubmit: () => null,
    updateTerm: () => null
});

const SearchProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(searchReducer, searchInitialState);
    const [searchTerm, setSearchTerm] = useState("");

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        console.log("handleSubmit!!");
        dispatch({ type: LOADING });
        if (searchTerm !== "") {
            searchByTerm();
        }
    }

    function updateTerm(event: React.ChangeEvent<HTMLInputElement>) {
        const { target: { value } } = event;
        console.log("updateTerm!!");
        setSearchTerm(value);
    }

    async function searchByTerm() {
        try {
            const { data: { results: movieResults } } = await moviesApi.search(searchTerm);
            const { data: { results: tvResults } } = await tvApi.search(searchTerm);
            dispatch({ type: SUCCESS, payload: { movieResults, tvResults } });
        } catch {
            dispatch({ type: FAIL });
        }
    }

    return (
        <SearchContext.Provider value={{ state, dispatch, searchTerm, handleSubmit, updateTerm }}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearchTerm = () => {
    const { searchTerm } = useContext(SearchContext);
    return searchTerm;
}

export const useSearchFunctions = () => {
    const { handleSubmit, updateTerm } = useContext(SearchContext);
    return { handleSubmit, updateTerm };
}

export const useSearchDispatch = () => {
    const { dispatch } = useContext(SearchContext);
    return dispatch;
}

export const useSearchState = () => {
    const { state } = useContext(SearchContext);
    return state;
}

export default SearchProvider;