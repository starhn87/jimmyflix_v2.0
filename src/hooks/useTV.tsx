import { useEffect } from "react";
import { FAIL, SUCCESS } from "../actions";
import { tvApi } from "../api";
import { useTVDispatch } from "../contexts/TVContext";


export const useTV = (): void => {
    const dispatch = useTVDispatch();

    async function getTV() {
        try {
            const { data: { results: topRated } } = await tvApi.topRated();
            const { data: { results: popular } } = await tvApi.popular();
            const { data: { results: airingToday } } = await tvApi.airingToday();
            console.log(topRated, airingToday, popular);
            dispatch({ type: SUCCESS, payload: { topRated, popular, airingToday } });
        } catch {
            dispatch({ type: FAIL });
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getTV();
    }, []);
}

