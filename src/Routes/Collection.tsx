import React from "react";
import Message from "../Components/Message";
import { useCollection } from "../hooks/useCollection";
import Section from "../Components/Section";
import styled from "styled-components";
import Poster from "../Components/Poster";

const Container = styled.div`
    margin-bottom: 30px;
    margin-top: 20px;
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
            <Section slide={false}>
                {collection && collection.length > 0 &&
                    (collection.filter(movie => movie.release_date !== '').map((c, index) => (
                        <Poster
                            key={c.id}
                            id={c.id}
                            imageUrl={c.poster_path}
                            title={c.title}
                            rating={c.vote_average}
                            year={''}
                            isMovie={true}
                        />
                    )
                    ))
                }
            </Section>
        </Container>
    )
}

export default Collection;

