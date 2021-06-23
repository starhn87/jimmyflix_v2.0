import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import useRouter from "use-react-router";
import { moviesApi, tvApi } from "../api";
import { fail, success, reset } from "../reducers/DetailReducer";

export function useDetail(): void {
    const { match: { params: { id }, url }, location: { pathname }, history: { push } } = useRouter<any>();
    const dispatch = useDispatch();
    const isMovie = pathname.includes("/movie/");

    const controlHistory = () => {
        window.onpopstate = (event: any) => {
            const { state: { stack } } = event;
            window.history.go(stack * (-1));
        }
    }

    const getDetail = async () => {
        const parsedId = parseInt(id);

        if (isNaN(parsedId)) {
            return push("/");
        }

        let results;
        try {
            if (isMovie) {
                ({ data: results } = await moviesApi.movieDetail(parsedId));
            } else {
                ({ data: results } = await tvApi.showDetail(parsedId));
            }
            dispatch(success({ results }));
        } catch {
            dispatch(fail());
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getDetail();
        controlHistory();

        return () => {
            dispatch(reset());
            window.onpopstate = () => { };
        };
    }, [id]);
}

