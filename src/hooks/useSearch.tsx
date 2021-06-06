import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moviesApi, tvApi } from "../api";
import { fail, success, loading, term } from "../reducers/SearchReducer";
import { SearchProps } from "../Routes/Search";


export const useSearch = () => {
    const searchTerm = useSelector((state: SearchProps) => state.search.searchTerm);
    const dispatch = useDispatch();

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        dispatch(loading());
        if (searchTerm !== "") {
            searchByTerm();
        }
    }

    function updateTerm(event: React.ChangeEvent<HTMLInputElement>) {
        const { target: { value } } = event;
        dispatch(term(value));
    }

    const searchByTerm = useCallback(async () => {
        try {
            const { data: { results: movieResults } } = await moviesApi.search(searchTerm);
            const { data: { results: tvResults } } = await tvApi.search(searchTerm);
            dispatch(success({ movieResults, tvResults }));
        } catch {
            dispatch(fail());
        }
    }, [searchTerm]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return { searchTerm, updateTerm, handleSubmit };
}

