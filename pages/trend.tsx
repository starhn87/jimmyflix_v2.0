import React, { useEffect } from 'react'
import { trendingApi } from './api'
import styled from '@emotion/styled'
import { dehydrate, QueryClient, useQueries } from 'react-query'
import Loading from '../components/common/Loading'
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
    { data: movies, isFetching: isMoviesFetching, isError: isMoviesError },
    { data: tvs, isFetching: isTvsFetching, isError: isTvError },
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

  if (isMoviesFetching || isTvsFetching) {
    return <Loading />
  }

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
        />
        <Infos
          slider={true}
          data={tvs}
          title={'TV Show Trend'}
          isError={isTvError}
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

  const timeType = 'Day'
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
