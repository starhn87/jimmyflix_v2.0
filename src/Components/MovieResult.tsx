import React from "react";
import styled from "styled-components";
import { useHomeState } from "../contexts/HomeContext";
import Message from "./Message";
import Poster from "./Poster";
import Section from "./Section";

const Container = styled.div`
    padding: 20px;
`;

export interface Movie {
    id: number,
    poster_path: string,
    original_title: string,
    vote_average: number,
    release_date: string
}

function MovieResult() {
    const { nowPlaying, upcoming, popular, error } = useHomeState();

    return (
        <Container>
            {nowPlaying && nowPlaying.length > 0 && (
                <Section title="Now Playing">
                    {nowPlaying.map((movie: Movie) => (
                        <Poster
                            key={movie.id}
                            id={movie.id}
                            imageUrl={movie.poster_path}
                            title={movie.original_title}
                            rating={movie.vote_average}
                            year={movie.release_date && movie.release_date.substring(0, 4)}
                            isMovie={true}
                        />))}
                </Section>
            )}
            {upcoming && upcoming.length > 0 && (
                <Section title="Upcoming Movies">
                    {upcoming.map((movie: Movie) => (
                        <Poster
                            key={movie.id}
                            id={movie.id}
                            imageUrl={movie.poster_path}
                            title={movie.original_title}
                            rating={movie.vote_average}
                            year={movie.release_date && movie.release_date.substring(0, 4)}
                            isMovie={true}
                        />))}
                </Section>
            )}
            {popular && popular.length > 0 && (
                <Section title="Popular Movies">
                    {popular.map((movie: Movie) => (
                        <Poster
                            key={movie.id}
                            id={movie.id}
                            imageUrl={movie.poster_path}
                            title={movie.original_title}
                            rating={movie.vote_average}
                            year={movie.release_date && movie.release_date.substring(0, 4)}
                            isMovie={true}
                        />
                    ))}
                </Section>
            )}
            {error && <Message color="#e74c3c" text={error} />}
        </Container>
    )
}

export default MovieResult;