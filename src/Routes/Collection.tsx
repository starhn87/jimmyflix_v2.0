import React from "react";
import Message from "../Components/Message";
import { useCollection } from "../hooks/useCollection";
import Section from "../Components/Section";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { customMedia } from "../Components/GlobalStyles";

const Container = styled.div`
    width: 70%;
    margin-bottom: 30px;
    margin-top: 20px;
    
    ${customMedia.lessThan('mobile')`
        width: 100%;
    `}
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

