import React from "react";
import styled from "styled-components";
import Loader from "../Components/Loader";
import Helmet from "react-helmet";
import { useSearch } from "../hooks/useSearch";
import SearchResult from "../Components/SearchResult";
import Header from "../Components/Header";
import { useSelector } from "react-redux";
import { SearchState } from "../reducers/SearchReducer";

const Container = styled.div`
    padding: 0 20px;

`;

const Form = styled.form`
    margin: 10px 0 50px;
`;

const Input = styled.input`
    all: unset;
    width: 100%;
    font-size: 28px;
`;

export interface SearchProps {
    search: SearchState
}

function Search() {
    const { searchTerm, updateTerm, handleSubmit } = useSearch();
    const loading = useSelector((state: SearchProps) => state.search.loading);

    return <Container>
        <Helmet>
            <title>Search | Jimmyflix</title>
        </Helmet>
        <Header />
        <Form onSubmit={handleSubmit}>
            <Input placeholder="Search Movies or TV Shows..." value={searchTerm} onChange={updateTerm}>
            </Input>
        </Form>

        {
            loading !== null ? (
                loading ? (
                    <Loader />
                ) : (
                    <SearchResult />
                )
            ) : (
                <>
                </>
            )
        }

    </Container>
}

export default Search;

