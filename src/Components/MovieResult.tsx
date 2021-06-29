import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import styled from "styled-components";
import { HomeState } from "../reducers/HomeReducer";
import Message from "./Message";
import Poster from "./Poster";
import Section from "./Section";

const Container = styled.div`
    padding: 20px;
`;

export interface Movie {
    id: number,
    poster_path: string,
    title: string,
    vote_average: number,
    release_date: string
}

interface Props {
    home: HomeState
}

function MovieResult() {
    const { nowPlaying, upcoming, popular, error } = useSelector((state: Props) => ({ ...state.home }), shallowEqual);

    return (
        <Container>
            {nowPlaying && nowPlaying.length > 0 && (
                <Section slide={true} title="Now Playing">
                    {nowPlaying.map((movie: Movie) => (
                        <Poster
                            key={movie.id}
                            id={movie.id}
                            imageUrl={movie.poster_path}
                            title={movie.title}
                            rating={movie.vote_average}
                            year={movie.release_date && movie.release_date.substring(0, 4)}
                            isMovie={true}
                        />))}
                </Section>
            )}
            {upcoming && upcoming.length > 0 && (
                <Section slide={true} title="Upcoming Movies">
                    {upcoming.map((movie: Movie) => (
                        <Poster
                            key={movie.id}
                            id={movie.id}
                            imageUrl={movie.poster_path}
                            title={movie.title}
                            rating={movie.vote_average}
                            year={movie.release_date && movie.release_date.substring(0, 4)}
                            isMovie={true}
                        />))}
                </Section>
            )}
            {popular && popular.length > 0 && (
                <Section slide={true} title="Popular Movies">
                    {popular.map((movie: Movie) => (
                        <Poster
                            key={movie.id}
                            id={movie.id}
                            imageUrl={movie.poster_path}
                            title={movie.title}
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