import React, { useEffect } from 'react'
import Helmet from '../../components/common/Helmet'
import Header from '../../components/common/Header'
import { tvApi } from '../api'
import { Container } from '..'
import { useQueries } from 'react-query'
import Loading from '../../components/common/Loading'
import Infos from '../../components/common/Infos'

export function TV() {
  const [
    { data: topRated, isFetched: isTopRatedFetched, isError: isTopRatedError },
    { data: popular, isFetched: isPopularFetched, isError: isPopularError },
    {
      data: airingToday,
      isFetched: isAiringTodayFetched,
      isError: isAiringTodayError,
    },
    { data: onTheAir, isFetched: isOnTheAirFetched, isError: isOnTheAirError },
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
    !isTopRatedFetched ||
    !isPopularFetched ||
    !isAiringTodayFetched ||
    !isOnTheAirFetched
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

export default TV
