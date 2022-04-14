import React, { useEffect } from 'react'
import { moviesApi } from '../api'
import styled from 'styled-components'
import Section from '../components/common/Section'
import Poster from '../components/common/Poster'
import Message from '../components/common/Message'
import { IMovie } from '../interface'
import { useQueries } from 'react-query'
import Loading from '../components/common/Loading'
import HelmetWrapper from '../components/common/Helmet'
import Slider from '../components/common/Slider'

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
        <Slider
          data={nowPlaying}
          title={'Now Playing Movies'}
          isError={isNowPlayingError}
        />
        <Slider
          data={topRated}
          title={'Top Rated Movies'}
          isError={isTopRatedError}
        />
        <Slider
          data={upcoming}
          title={'Upcoming Movies'}
          isError={isUpcomingError}
        />
        <Slider
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
