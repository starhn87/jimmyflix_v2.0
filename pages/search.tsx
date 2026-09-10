import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useQueries } from 'react-query'
import Helmet from '../components/common/Helmet'
import { Container } from '.'
import { moviesApi, tvApi } from './api'
import SearchBar from '../components/SearchBar'
import Infos from '../components/common/Infos'

const getQueryValue = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value ?? '').trim()

function Search() {
  const router = useRouter()
  const searchValue = router.isReady ? getQueryValue(router.query.q) : ''
  const hasSearch = router.isReady && Boolean(searchValue)
  const [
    {
      data: movies = [],
      isLoading: isMoviesLoading,
      isFetching: isMoviesFetching,
      isError: isMoviesError,
    },
    {
      data: tvs = [],
      isLoading: isTvLoading,
      isFetching: isTvFetching,
      isError: isTvError,
    },
  ] = useQueries([
    {
      queryKey: ['movieSearch', searchValue],
      queryFn: () => moviesApi.search(searchValue),
      enabled: hasSearch,
    },
    {
      queryKey: ['tvSearch', searchValue],
      queryFn: () => tvApi.search(searchValue),
      enabled: hasSearch,
    },
  ])

  const onSubmit = (query: string) => {
    void router.push({
      pathname: '/search',
      query: { q: query },
    })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [searchValue])

  const isInitialLoading = hasSearch && isMoviesLoading && isTvLoading
  const isRefreshing =
    hasSearch && !isInitialLoading && (isMoviesFetching || isTvFetching)
  const hasNoResults =
    hasSearch &&
    !isInitialLoading &&
    !isMoviesLoading &&
    !isTvLoading &&
    !isMoviesError &&
    !isTvError &&
    movies.length === 0 &&
    tvs.length === 0

  return (
    <Container>
      <Helmet
        content={searchValue ? `${searchValue} | Jimmyflix` : 'Search | Jimmyflix'}
      />
      <SearchBar
        initialValue={searchValue}
        compact={hasSearch}
        onSubmit={onSubmit}
      />

      {isInitialLoading && (
        <SearchStatus role="status" aria-live="polite">
          Searching for “{searchValue}”…
        </SearchStatus>
      )}

      {isRefreshing && (
        <RefreshStatus role="status" aria-live="polite">
          Updating results…
        </RefreshStatus>
      )}

      {hasNoResults && (
        <SearchStatus role="status">
          No results for “{searchValue}”. Try another title or check the
          spelling.
        </SearchStatus>
      )}

      {hasSearch && !isInitialLoading && !hasNoResults && (
        <Results aria-label={`Search results for ${searchValue}`}>
          {isMoviesLoading ? (
            <ResultMessage role="status">Searching movies…</ResultMessage>
          ) : movies.length > 0 ? (
            <Infos
              slider={false}
              data={movies}
              title="Movies"
              isError={isMoviesError}
            />
          ) : isMoviesError ? (
            <ResultMessage error>Movies could not be loaded.</ResultMessage>
          ) : (
            <EmptySection>
              <h2>Movies</h2>
              <p>No movie results for “{searchValue}”.</p>
            </EmptySection>
          )}

          {isTvLoading ? (
            <ResultMessage role="status">Searching TV shows…</ResultMessage>
          ) : tvs.length > 0 ? (
            <Infos
              slider={false}
              data={tvs}
              title="TV Shows"
              isError={isTvError}
            />
          ) : isTvError ? (
            <ResultMessage error>TV shows could not be loaded.</ResultMessage>
          ) : (
            <EmptySection>
              <h2>TV Shows</h2>
              <p>No TV show results for “{searchValue}”.</p>
            </EmptySection>
          )}
        </Results>
      )}
    </Container>
  )
}

export default Search

const Results = styled.main`
  min-width: 0;
`

const SearchStatus = styled.p`
  max-width: 680px;
  margin: 72px auto 0;
  padding: 0 16px;
  color: rgba(255, 255, 255, 0.72);
  font-size: clamp(18px, 3vw, 24px);
  line-height: 1.5;
  text-align: center;
`

const RefreshStatus = styled.p`
  margin: -22px 0 20px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
  text-align: center;
`

const EmptySection = styled.section`
  margin: 10px 0 48px;

  h2 {
    font-size: 20px;
    font-weight: 600;
  }

  p {
    margin-top: 18px;
    color: rgba(255, 255, 255, 0.65);
    line-height: 1.5;
  }
`

const ResultMessage = styled.p<{ error?: boolean }>`
  margin: 24px 0 48px;
  color: ${(props) => (props.error ? '#ff9c91' : 'rgba(255, 255, 255, 0.65)')};
  font-size: 18px;
`
