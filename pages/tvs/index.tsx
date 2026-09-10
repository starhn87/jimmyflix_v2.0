import React, { useEffect } from 'react'
import Helmet from '../../components/common/Helmet'
import { tvApi } from '../api'
import { Container } from '..'
import { dehydrate, QueryClient, useQueries } from 'react-query'
import Infos from '../../components/common/Infos'
import { GetServerSidePropsContext } from 'next'
import { isClientReq } from '../../utils'

export function TV() {
  const [
    {
      data: topRated,
      isLoading: isTopRatedLoading,
      isFetching: isTopRatedFetching,
      isError: isTopRatedError,
      refetch: refetchTopRated,
    },
    {
      data: popular,
      isLoading: isPopularLoading,
      isFetching: isPopularFetching,
      isError: isPopularError,
      refetch: refetchPopular,
    },
    {
      data: airingToday,
      isLoading: isAiringTodayLoading,
      isFetching: isAiringTodayFetching,
      isError: isAiringTodayError,
      refetch: refetchAiringToday,
    },
    {
      data: onTheAir,
      isLoading: isOnTheAirLoading,
      isFetching: isOnTheAirFetching,
      isError: isOnTheAirError,
      refetch: refetchOnTheAir,
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

  return (
    <>
      <Helmet content="TV Shows | Jimmyflix" />
      <Container>
        <Infos
          slider={true}
          data={topRated}
          title={'Top Rated Shows'}
          isError={isTopRatedError}
          isLoading={isTopRatedLoading}
          isFetching={isTopRatedFetching}
          onRetry={() => void refetchTopRated()}
        />
        <Infos
          slider={true}
          data={popular}
          title={'Popular Shows'}
          isError={isPopularError}
          isLoading={isPopularLoading}
          isFetching={isPopularFetching}
          onRetry={() => void refetchPopular()}
        />
        <Infos
          slider={true}
          data={onTheAir}
          title={'On the Air Shows'}
          isError={isOnTheAirError}
          isLoading={isOnTheAirLoading}
          isFetching={isOnTheAirFetching}
          onRetry={() => void refetchOnTheAir()}
        />
        <Infos
          slider={true}
          data={airingToday}
          title={'Airing Today Shows'}
          isError={isAiringTodayError}
          isLoading={isAiringTodayLoading}
          isFetching={isAiringTodayFetching}
          onRetry={() => void refetchAiringToday()}
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
