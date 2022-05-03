import React, { useEffect } from 'react'
import Helmet from '../../components/common/Helmet'
import Header from '../../components/common/Header'
import { tvApi } from '../api'
import { Container } from '..'
import { dehydrate, QueryClient, useQueries } from 'react-query'
import Loading from '../../components/common/Loading'
import Infos from '../../components/common/Infos'
import { GetServerSidePropsContext } from 'next'
import { isClientReq } from '../../utils'

export function TV() {
  const [
    {
      data: topRated,
      isFetching: isTopRatedFetching,
      isError: isTopRatedError,
    },
    { data: popular, isFetching: isPopularFetching, isError: isPopularError },
    {
      data: airingToday,
      isFetching: isAiringTodayFetching,
      isError: isAiringTodayError,
    },
    {
      data: onTheAir,
      isFetching: isOnTheAirFetching,
      isError: isOnTheAirError,
    },
  ] = useQueries([
    {
      queryKey: ['topRatedTv'],
      queryFn: () => tvApi.topRated(),
    },
    {
      queryKey: ['popularTv'],
      queryFn: () => tvApi.popular(),
    },
    {
      queryKey: ['airingToday'],
      queryFn: () => tvApi.airingToday(),
    },
    {
      queryKey: ['onTheAir'],
      queryFn: () => tvApi.onTheAir(),
    },
  ])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (
    isTopRatedFetching ||
    isPopularFetching ||
    isAiringTodayFetching ||
    isOnTheAirFetching
  ) {
    return <Loading />
  }

  return (
    <>
      <Helmet content="TV Shows | Jimmyflix" />
      <Header />
      <Container>
        <Infos
          slider={true}
          data={topRated}
          title={'Top Rated Shows'}
          isError={isTopRatedError}
        />
        <Infos
          slider={true}
          data={popular}
          title={'Popular Shows'}
          isError={isPopularError}
        />
        <Infos
          slider={true}
          data={onTheAir}
          title={'On the Air Shows'}
          isError={isOnTheAirError}
        />
        <Infos
          slider={true}
          data={airingToday}
          title={'Airing Today Shows'}
          isError={isAiringTodayError}
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

  await queryClient.prefetchQuery(['airingToday'], () => tvApi.airingToday())
  await queryClient.prefetchQuery(['onTheAir'], () => tvApi.onTheAir())
  await queryClient.prefetchQuery(['popularTv'], () => tvApi.popular())
  await queryClient.prefetchQuery(['topRatedTv'], () => tvApi.topRated())

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default TV
