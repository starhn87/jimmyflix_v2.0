import React, { useEffect } from 'react'
import { moviesApi } from './api'
import styled from '@emotion/styled'
import { dehydrate, QueryClient, useQueries } from 'react-query'
import HelmetWrapper from '../components/common/Helmet'
import Infos from '../components/common/Infos'
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next'
import { isClientReq } from '../utils'

function Home() {
  const [
    {
      data: nowPlaying,
      isLoading: isNowPlayingLoading,
      isFetching: isNowPlayingFetching,
      isError: isNowPlayingError,
      refetch: refetchNowPlaying,
    },
    {
      data: upcoming,
      isLoading: isUpcomingLoading,
      isFetching: isUpcomingFetching,
      isError: isUpcomingError,
      refetch: refetchUpcoming,
    },
    {
      data: popular,
      isLoading: isPopularLoading,
      isFetching: isPopularFetching,
      isError: isPopularError,
      refetch: refetchPopular,
    },
    {
      data: topRated,
      isLoading: isTopRatedLoading,
      isFetching: isTopRatedFetching,
      isError: isTopRatedError,
      refetch: refetchTopRated,
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

  return (
    <>
      <HelmetWrapper content="Movies | Jimmyflix" />
      <Container>
        <Infos
          slider={true}
          data={nowPlaying}
          title={'Now Playing Movies'}
          isError={isNowPlayingError}
          isLoading={isNowPlayingLoading}
          isFetching={isNowPlayingFetching}
          onRetry={() => void refetchNowPlaying()}
        />
        <Infos
          slider={true}
          data={topRated}
          title={'Top Rated Movies'}
          isError={isTopRatedError}
          isLoading={isTopRatedLoading}
          isFetching={isTopRatedFetching}
          onRetry={() => void refetchTopRated()}
        />
        <Infos
          slider={true}
          data={upcoming}
          title={'Upcoming Movies'}
          isError={isUpcomingError}
          isLoading={isUpcomingLoading}
          isFetching={isUpcomingFetching}
          onRetry={() => void refetchUpcoming()}
        />
        <Infos
          slider={true}
          data={popular}
          title={'Popular Movies'}
          isError={isPopularError}
          isLoading={isPopularLoading}
          isFetching={isPopularFetching}
          onRetry={() => void refetchPopular()}
        />
      </Container>
    </>
  )
}

export async function getServerSideProps({
  req: { url },
}: GetServerSidePropsContext) {
  if (isClientReq(url)) {
    return {
      props: {},
    }
  }

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(['nowPlaying'], () => moviesApi.nowPlaying())
  await queryClient.prefetchQuery(['upcoming'], () => moviesApi.upcoming())
  await queryClient.prefetchQuery(['popularMovie'], () => moviesApi.popular())
  await queryClient.prefetchQuery(['topRatedMovie'], () => moviesApi.topRated())

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Home

export const Container = styled.div`
  padding: 20px;
`
