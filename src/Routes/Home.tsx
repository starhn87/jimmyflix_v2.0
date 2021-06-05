import React from "react";
import Loader from "../Components/Loader";
import Helmet from "react-helmet";
import { useHome } from "../hooks/useHome";
import MovieResult from "../Components/MovieResult";
import Header from "../Components/Header";
import { useSelector } from "react-redux";
import { HomeState } from "../reducers/HomeReducer";

function Home() {
    useHome();
    const loading = useSelector((state: HomeState) => state.loading);

    return <>
        <Helmet>
            <title>Movies | Jimmyflix</title>
        </Helmet>
        <Header />
        {
            loading ? (
                <Loader />
            ) : (
                <MovieResult />
            )
        }
    </>
}

export default Home;

