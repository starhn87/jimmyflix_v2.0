import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moviesApi, tvApi } from "../api";
import { fail, success, loading, term } from "../reducers/SearchReducer";
import { SearchProps } from "../Routes/Search";

interface Props {
    searchTerm: string,
    updateTerm: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleSubmit: (event: React.FormEvent) => void
}

export function useSearch(): Props {
    const searchTerm = useSelector((state: SearchProps) => state.search.searchTerm);
    const dispatch = useDispatch();

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        dispatch(loading());
        if (searchTerm !== "") {
            searchByTerm();
        }
    }

    const updateTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { value } } = event;
        dispatch(term(value));
    }

    const searchByTerm = async () => {
        try {
            const { data: { results: movieResults } } = await moviesApi.search(searchTerm);
            const { data: { results: tvResults } } = await tvApi.search(searchTerm);
            dispatch(success({ movieResults, tvResults }));
        } catch {
            dispatch(fail());
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return { searchTerm, updateTerm, handleSubmit };
}

