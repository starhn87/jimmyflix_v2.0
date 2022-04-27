import React, { useEffect } from 'react'
import Helmet from '../components/common/Helmet'
import Loading from '../components/common/Loading'
import { Container } from '.'
import { moviesApi, tvApi } from './api'
import { useQueries } from 'react-query'
import SearchBar from '../components/SearchBar'
import Message from '../components/common/Message'
import Infos from '../components/common/Infos'
import { useRecoilState } from 'recoil'
import { isSearchedState, searchValueState } from '../recoil/store'

function Search() {
  const [isSearched, setIsSearched] = useRecoilState(isSearchedState)
  const [searchValue, setSearchValue] = useRecoilState(searchValueState)
  const [
    { data: movies, isFetched: isMoviesFetched, isError: isMoviesError },
    { data: tvs, isFetched: isTvFetched, isError: isTvError },
  ] = useQueries([
    {
      queryKey: ['movieSearch', searchValue],
      queryFn: () => moviesApi.search(searchValue, isSearched),
    },
    {
      queryKey: ['tvSearch', searchValue],
      queryFn: () => tvApi.search(searchValue, isSearched),
    },
  ])

  const onSubmit = (editingValue: string) => {
    setSearchValue(editingValue)
    setIsSearched(true)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (searchValue !== '' && (!isMoviesFetched || !isTvFetched)) {
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
