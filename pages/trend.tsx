import React, { useEffect } from 'react'
import { trendingApi } from './api'
import styled from '@emotion/styled'
import { dehydrate, QueryClient, useQueries } from 'react-query'
import HelmetWrapper from '../components/common/Helmet'
import Infos from '../components/common/Infos'
import TimeTypeSwitch from '../components/TimeTypeSwitch'
import { useRecoilValue } from 'recoil'
import { timeTypeState } from '../recoil/store'
import { GetServerSidePropsContext } from 'next'
import { isClientReq } from '../utils'
import { TimeType } from '../interface'

function Trend() {
  const timeType = useRecoilValue(timeTypeState)
  const [
    {
      data: movies,
      isLoading: isMoviesLoading,
      isFetching: isMoviesFetching,
      isError: isMoviesError,
      refetch: refetchMovies,
    },
    {
      data: tvs,
      isLoading: isTvsLoading,
      isFetching: isTvsFetching,
      isError: isTvError,
      refetch: refetchTvs,
    },
  ] = useQueries([
    {
      queryKey: ['movieTrend', timeType],
      queryFn: () => trendingApi.movie(timeType),
    },
    {
      queryKey: ['tvTrend', timeType],
      queryFn: () => trendingApi.tv(timeType),
    },
  ])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <HelmetWrapper content="Trend | Jimmyflix" />
      <TimeTypeSwitch />
      <Container>
        <Infos
          slider={true}
          data={movies}
          title={'Movie Trend'}
          isError={isMoviesError}
          isLoading={isMoviesLoading}
          isFetching={isMoviesFetching}
          onRetry={() => void refetchMovies()}
        />
        <Infos
          slider={true}
          data={tvs}
          title={'TV Show Trend'}
          isError={isTvError}
          isLoading={isTvsLoading}
          isFetching={isTvsFetching}
          onRetry={() => void refetchTvs()}
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

  const timeType: TimeType = 'day'
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(['movieTrend', timeType], () =>
    trendingApi.movie(timeType),
  )
  await queryClient.prefetchQuery(['tvTrend', timeType], () =>
    trendingApi.tv(timeType),
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Trend

export const Container = styled.div`
  padding: 20px;
`
