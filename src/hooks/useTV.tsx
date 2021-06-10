import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { tvApi } from "../api";
import { fail, reset, success } from "../reducers/TVReducer";


export function useTV(): void {
    const dispatch = useDispatch();

    const getTV = async () => {
        try {
            const { data: { results: topRated } } = await tvApi.topRated();
            const { data: { results: popular } } = await tvApi.popular();
            const { data: { results: airingToday } } = await tvApi.airingToday();
            dispatch(success({ topRated, popular, airingToday }));
        } catch {
            dispatch(fail());
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getTV();

        return () => {
            dispatch(reset());
        }
    }, []);
}

