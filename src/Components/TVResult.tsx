import React from "react";
import styled from "styled-components";
import { useTVState } from "../contexts/TVContext";
import Message from "./Message";
import Poster from "./Poster";
import Section from "./Section";

const Container = styled.div`
    padding: 20px;
`;

export interface Show {
    id: number,
    poster_path: string,
    original_name: string,
    vote_average: number,
    first_air_date: string
}

function TVResult() {
    const {
        topRated,
        popular,
        airingToday,
        error
    } = useTVState();

    return (
        <Container>
            {topRated && topRated.length > 0 && (
                <Section title="Top Rated Shows">
                    {topRated.map((show: Show) => (
                        <Poster
                            key={show.id}
                            id={show.id}
                            imageUrl={show.poster_path}
                            title={show.original_name}
                            rating={show.vote_average}
                            year={show.first_air_date && show.first_air_date.substring(0, 4)}
                        />
                    ))}
                </Section>
            )}
            {popular && popular.length > 0 && (
                <Section title="Popular Shows">
                    {popular.map((show: Show) => (
                        <Poster
                            key={show.id}
                            id={show.id}
                            imageUrl={show.poster_path}
                            title={show.original_name}
                            rating={show.vote_average}
                            year={show.first_air_date && show.first_air_date.substring(0, 4)}
                        />
                    ))}
                </Section>
            )}
            {airingToday && airingToday.length > 0 && (
                <Section title="Airing Today Shows">
                    {airingToday.map((show: Show) => (
                        <Poster
                            key={show.id}
                            id={show.id}
                            imageUrl={show.poster_path}
                            title={show.original_name}
                            rating={show.vote_average}
                            year={show.first_air_date && show.first_air_date.substring(0, 4)}
                        />
                    ))}
                </Section>
            )}
            {error && <Message color="#e74c3c" text={error} />}
        </Container>
    )
}

export default TVResult;