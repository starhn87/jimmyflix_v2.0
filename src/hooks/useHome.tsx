import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { moviesApi } from "../api";
import { fail, success } from "../reducers/HomeReducer";

export const useHome = () => {
    const dispatch = useDispatch();

    async function getHome() {
        try {
            const { data: { results: nowPlaying } } = await moviesApi.nowPlaying();
            const { data: { results: upcoming } } = await moviesApi.upcoming();
            const { data: { results: popular } } = await moviesApi.popular();
            dispatch(success({ nowPlaying, upcoming, popular }));
            throw new Error();
        } catch {
            dispatch(fail());
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getHome();
    }, []);
}


