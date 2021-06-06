import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useRouter from "use-react-router";
import { moviesApi, tvApi } from "../api";
import { fail, success, reset } from "../reducers/DetailReducer";

export const useDetail = () => {
    const { match: { params: { id } }, location: { pathname }, history: { push } } = useRouter<any>();
    const dispatch = useDispatch();
    const isMovie = pathname.includes("/movie/");

    async function getDetail() {
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

        return () => {
            dispatch(reset())
        };
    }, [id]);
}

