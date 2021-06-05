import React from "react";
import Helmet from "react-helmet";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import { useDetail } from "../hooks/useDetail";
import Info from "../Components/Info";
import Header from "../Components/Header";
import { useSelector } from "react-redux";
import { DetailState } from "../reducers/DetailReducer";

export interface DetailProps {
    detail: DetailState
}

function Detail() {
    useDetail();
    const { loading, error } = useSelector((state: DetailProps) => ({ ...state.detail }));

    return loading ? (
        <>
            <Helmet>
                <title>Loading | Jimmyflix</title>
            </Helmet>
            <Header />
            <Loader />
        </>
    ) : (
        <>
            <Header />
            {
                error ? (
                    <Message color="#e74c3c" text={error}></Message>
                ) : (
                    <Info />
                )
            }
        </>
    )
}

export default Detail;

