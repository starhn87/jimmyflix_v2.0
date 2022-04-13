import React, { useEffect } from 'react'
import Helmet from '../components/common/Helmet'
import { useAppDispatch, useAppSelector } from '../redux/store'
import Loading from '../components/common/Loading'
import { Container } from './Home'
import { IMovie, IShow } from '../interface'
import { moviesApi, tvApi } from '../api'
import { useQueries } from 'react-query'
import SearchBar from '../components/SearchBar'
import { searched } from '../redux/slice'
import Section from '../components/common/Section'
import Poster from '../components/common/Poster'
import Message from '../components/common/Message'

function Search() {
  const { isSearched, value } = useAppSelector((state) => state.search)
  const dispatch = useAppDispatch()
  const [
    { data: movies, isFetched: isMoviesFetched, isError: isMoviesError },
    { data: tvs, isFetched: isTvFetched, isError: isTvError },
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

  if (value !== '' && (!isMoviesFetched || !isTvFetched)) {
    return <Loading />
  }

  return (
    <Container>
      <Helmet content="Search | Jimmyflix" />
      {isSearched ? (
        <>
          {movies?.length > 0 && (
            <Section slide={false} title="Movies">
              {movies.map((movie: IMovie) => (
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
          {tvs?.length > 0 && (
            <Section slide={false} title="TV Shows">
              {tvs.map((show: IShow) => (
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
          {isMoviesError && (
            <Message color="#e74c3c" text={'Error in movie searching.'} />
          )}
          {isTvError && (
            <Message color="#e74c3c" text={'Error in tv show searching.'} />
          )}
          {tvs && movies && tvs.length === 0 && movies.length === 0 && (
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
