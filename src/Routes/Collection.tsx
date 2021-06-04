import React from "react";
import Message from "../Components/Message";
import { useCollection } from "../hooks/useCollection";
import Section from "../Components/Section";
import styled from "styled-components";
import { Link, Route } from "react-router-dom";
import DetailProvider from "../contexts/DetailContext";
import Detail from "./Detail";

const Container = styled.div`
    width: 70%;
`;

const Item = styled.img`
    width: 100%;
`;

interface Props {
    id: number
}

const Collection = ({ id }: Props) => {
    const {
        collection,
        error
    } = useCollection(id);

    return error ? (
        <Message color="#e74c3c" text={error}></Message>
    ) : (
        <Container>
            <Section>
                {collection && collection.length > 0 &&
                    (collection.map((c, index) => (
                        <Link to={`/movie/${c.id}`}>
                            <Item key={index} src={`https://image.tmdb.org/t/p/original${c.poster_path}`} alt={c.name} />
                        </Link>
                    )
                    ))
                }
            </Section>
        </Container>
    )
}

export default Collection;

