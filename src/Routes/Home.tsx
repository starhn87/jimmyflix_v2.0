import React from "react";
import Loader from "../Components/Loader";
import Helmet from "react-helmet";
import { useHome } from "../hooks/useHome";
import { useHomeState } from "../contexts/HomeContext";
import MovieResult from "../Components/MovieResult";
import Header from "../Components/Header";

function Home() {
    useHome();
    const { loading } = useHomeState();

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

