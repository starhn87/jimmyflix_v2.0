import { useEffect } from "react";
import { FAIL, SUCCESS } from "../actions";
import { moviesApi } from "../api";
import { useHomeDispatch } from "../contexts/HomeContext";

export const useHome = (): void => {
    const dispatch = useHomeDispatch();

    async function getHome() {
        try {
            const { data: { results: nowPlaying } } = await moviesApi.nowPlaying();
            const { data: { results: upcoming } } = await moviesApi.upcoming();
            const { data: { results: popular } } = await moviesApi.popular();
            dispatch({ type: SUCCESS, payload: { nowPlaying, upcoming, popular } });
        } catch {
            dispatch({ type: FAIL });
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getHome();
    }, []);
}

