import React from "react";
import styled from "styled-components";
import Loader from "../Components/Loader";
import Helmet from "react-helmet";
import { useSearch } from "../hooks/useSearch";
import SearchResult from "../Components/SearchResult";
import Header from "../Components/Header";
import { shallowEqual, useSelector } from "react-redux";
import { SearchState } from "../reducers/SearchReducer";
import { customMedia } from "../Components/GlobalStyles";

const Container = styled.div`
    padding: 0 20px;
`;

const Form = styled.form`
    margin: 15px 0 50px;
`;

const Input = styled.input`
    padding-left: 10px;
    width: 500px;
    height: 50px;
    border-radius: 5px;
    font-size: 30px;
    &:focus {
        outline: none;
    }

    ${customMedia.lessThan('mobile')`
        width: 90%;
        font-size: 24px;
    `}
`;

export interface SearchProps {
    search: SearchState
}

function Search() {
    const { searchTerm, updateTerm, handleSubmit } = useSearch();
    const loading = useSelector((state: SearchProps) => state.search.loading, shallowEqual);

    return <Container>
        <Helmet>
            <title>Search | Jimmyflix</title>
        </Helmet>
        <Header />
        <Form onSubmit={handleSubmit}>
            <Input value={searchTerm} onChange={updateTerm}>
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

