import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import useRouter from "use-react-router";
import { moviesApi, tvApi } from "../api";
import { fail, success, reset, tab, cast } from "../reducers/DetailReducer";
import { DetailProps } from "../Routes/Detail";

export function useDetail(): void {
    const { match: { params: { id } }, location: { pathname }, history: { push } } = useRouter<any>();
    const dispatch = useDispatch();
    const isMovie = pathname.includes("/movie/");
    const tabName = useSelector((state: DetailProps) => (state.detail.tabName), shallowEqual);
    const parsedId = parseInt(id);

    const getDetail = async () => {

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

    const getCast = async () => {
        if (isNaN(parsedId)) {
            return push("/");
        }

        let casts;
        try {
            if (isMovie) {
                ({ data: { cast: casts } } = await moviesApi.cast(parsedId));
            } else {
                ({ data: { cast: casts } } = await tvApi.cast(parsedId));
            }
            dispatch(cast({ casts }));
        } catch {
            dispatch(fail());
        }
    }
<<<<<<< Updated upstream
=======
  }, [tabName, getCast])
>>>>>>> Stashed changes

    useEffect(() => {
        if (tabName === 'Credits') {
            getCast();
        }

    }, [tabName]);

    useEffect(() => {
        window.scrollTo(0, 0);
        getDetail();

        return () => {
            dispatch(reset());
        };
    }, [id]);
}

