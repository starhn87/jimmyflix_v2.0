import { useEffect } from "react";
import { RouteComponentProps, useHistory, useLocation, useParams } from "react-router-dom";
import useRouter from "use-react-router";
import { FAIL, SUCCESS } from "../actions";
import { moviesApi, tvApi } from "../api";
import { useDetailDispatch } from "../contexts/DetailContext";

export const useDetail = () => {
    const { match: { params: { id } }, location: { pathname }, history: { push } } = useRouter<any>();
    const dispatch = useDetailDispatch();
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
            console.log(results);
            dispatch({ type: SUCCESS, payload: results });
        } catch {
            dispatch({ type: FAIL });
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getDetail();
    }, [id]);
}

