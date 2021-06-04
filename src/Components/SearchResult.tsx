import React from "react";
import { useSearchState } from "../contexts/SearchContext";
import Message from "./Message";
import Poster from "./Poster";
import Section from "./Section";
import { Movie } from "./MovieResult";
import { Show } from "./TVResult";

function SearchResult() {
    const { movieResults, tvResults, error } = useSearchState();

    return (
        <>
            {movieResults && movieResults.length > 0 && (
                <Section title="Movie Results">
                    {movieResults.map((movie: Movie) =>
                        <Poster
                            key={movie.id}
                            id={movie.id}
                            imageUrl={movie.poster_path}
                            title={movie.original_title}
                            rating={movie.vote_average}
                            year={movie.release_date && movie.release_date.substring(0, 4)}
                            isMovie={true}
                        />
                    )
                    }
                </Section>
            )}
            {tvResults && tvResults.length > 0 && (
                <Section title="TV Shows Results">
                    {tvResults.map((show: Show) =>
                        <Poster
                            key={show.id}
                            id={show.id}
                            imageUrl={show.poster_path}
                            title={show.original_name}
                            rating={show.vote_average}
                            year={show.first_air_date && show.first_air_date.substring(0, 4)}
                        />
                    )
                    }
                </Section>
            )}
            {error && <Message color="#e74c3c" text={error} />}
            {tvResults
                && movieResults
                && tvResults.length === 0
                && movieResults.length === 0
                && <Message text="Nothing found" color="grey" />}
        </>
    )
}

export default SearchResult;