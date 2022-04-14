import React, { useEffect } from 'react'
import { moviesApi } from '../api'
import styled from 'styled-components'
import { useQueries } from 'react-query'
import Loading from '../components/common/Loading'
import HelmetWrapper from '../components/common/Helmet'
import Infos from '../components/common/Infos'

function Home() {
  const [
    {
      data: nowPlaying,
      isFetched: isNowPlayingFetched,
      isError: isNowPlayingError,
    },
    { data: upcoming, isFetched: isUpcomingFetched, isError: isUpcomingError },
    { data: popular, isFetched: isPopularFetched, isError: isPopularError },
    { data: topRated, isFetched: isTopRatedFetched, isError: isTopRatedError },
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
    !isNowPlayingFetched ||
    !isUpcomingFetched ||
    !isPopularFetched ||
    !isTopRatedFetched
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
