import React, { Suspense, useEffect, useRef } from 'react'
import Helmet from '../Components/Helmet'
import { useAppDispatch, useAppSelector } from '../redux/store'
import Loading from '../Components/Loading'
import { Container } from './Home'
import { Movie, SearchState, Show } from '../interface'
import { moviesApi, tvApi } from '../api'
import { useQueries } from 'react-query'
import Section from '../Components/Section'
import Poster from '../Components/Poster'
import Message from '../Components/Message'
import SearchBar from '../Components/SearchBar'
import { searched } from '../redux/SearchReducer'

export interface SearchProps {
  search: SearchState
}

function Search() {
  const { isSearched, value } = useAppSelector((state) => state.search)
  const dispatch = useAppDispatch()
  const [
    { data: movieResults, isError: error1 },
    { data: tvResults, isError: error2 },
  ] = useQueries([
    {
      queryKey: ['movieSearch', value],
      queryFn: () => moviesApi.search(value, isSearched),
    },
    {
      queryKey: ['tvSearch', value],
      queryFn: () => tvApi.search(value, isSearched),
    },
  ])

  const onSubmit = (editingValue: string) => {
    dispatch(searched(editingValue))
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (value !== '' && (!movieResults || !tvResults)) {
    return <Loading />
  }

  return (
    <Container>
      <Helmet content="Search | Jimmyflix" />
      {isSearched ? (
        <>
          {movieResults && movieResults.length > 0 && (
            <Section slide={false} title="Movies">
              {movieResults.map((movie: Movie) => (
                <Poster
                  key={movie.id}
                  id={movie.id}
                  imageUrl={movie.poster_path}
                  title={movie.title}
                  rating={movie.vote_average}
                  year={
                    movie.release_date && movie.release_date.substring(0, 4)
                  }
                  isMovie={true}
                />
              ))}
            </Section>
          )}
          {tvResults && tvResults.length > 0 && (
            <Section slide={false} title="TV Shows">
              {tvResults.map((show: Show) => (
                <Poster
                  key={show.id}
                  id={show.id}
                  imageUrl={show.poster_path}
                  title={show.name}
                  rating={show.vote_average}
                  year={
                    show.first_air_date && show.first_air_date.substring(0, 4)
                  }
                />
              ))}
            </Section>
          )}
          {error1 && (
            <Message color="#e74c3c" text={'Error in movie searching.'} />
          )}
          {error2 && (
            <Message color="#e74c3c" text={'Error in tv show searching.'} />
          )}
          {tvResults &&
            movieResults &&
            tvResults.length === 0 &&
            movieResults.length === 0 && (
              <Message text="Nothing found" color="grey" />
            )}
        </>
      ) : (
        <SearchBar onSubmit={onSubmit} />
      )}
    </Container>
  )
}

export default Search
