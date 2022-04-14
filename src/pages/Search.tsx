import React, { useEffect } from 'react'
import Helmet from '../components/common/Helmet'
import { useAppDispatch, useAppSelector } from '../redux/store'
import Loading from '../components/common/Loading'
import { Container } from './Home'
import { moviesApi, tvApi } from '../api'
import { useQueries } from 'react-query'
import SearchBar from '../components/SearchBar'
import { searched } from '../redux/slice'
import Message from '../components/common/Message'
import Infos from '../components/common/Infos'

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
          <Infos
            slider={false}
            data={movies}
            title={'Movies'}
            isError={isMoviesError}
          />
          <Infos
            slider={false}
            data={tvs}
            title={'TV Shows'}
            isError={isTvError}
          />
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
