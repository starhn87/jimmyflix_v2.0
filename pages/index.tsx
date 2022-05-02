import React, { useEffect } from 'react'
import { moviesApi } from './api'
import styled from '@emotion/styled'
import { useQueries } from 'react-query'
import Loading from '../components/common/Loading'
import HelmetWrapper from '../components/common/Helmet'
import Infos from '../components/common/Infos'

function Home() {
  const [
    {
      data: nowPlaying,
      isFetching: isNowPlayingFetching,
      isError: isNowPlayingError,
    },
    {
      data: upcoming,
      isFetching: isUpcomingFetching,
      isError: isUpcomingError,
    },
    { data: popular, isFetching: isPopularFetching, isError: isPopularError },
    {
      data: topRated,
      isFetching: isTopRatedFetching,
      isError: isTopRatedError,
    },
  ] = useQueries([
    {
      queryKey: ['nowPlaying'],
      queryFn: () => moviesApi.nowPlaying(),
    },
    {
      queryKey: ['upcoming'],
      queryFn: () => moviesApi.upcoming(),
    },
    {
      queryKey: ['popularMovie'],
      queryFn: () => moviesApi.popular(),
    },
    {
      queryKey: ['topRatedMovie'],
      queryFn: () => moviesApi.topRated(),
    },
  ])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (
    isNowPlayingFetching ||
    isUpcomingFetching ||
    isPopularFetching ||
    isTopRatedFetching
  ) {
    return <Loading />
  }

  return (
    <>
      <HelmetWrapper content="Movies | Jimmyflix" />
      <Container>
        <Infos
          slider={true}
          data={nowPlaying}
          title={'Now Playing Movies'}
          isError={isNowPlayingError}
        />
        <Infos
          slider={true}
          data={topRated}
          title={'Top Rated Movies'}
          isError={isTopRatedError}
        />
        <Infos
          slider={true}
          data={upcoming}
          title={'Upcoming Movies'}
          isError={isUpcomingError}
        />
        <Infos
          slider={true}
          data={popular}
          title={'Popular Movies'}
          isError={isPopularError}
        />
      </Container>
    </>
  )
}

export default Home

export const Container = styled.div`
  padding: 20px;
`
