import React, { useEffect } from 'react'
import Helmet from '../components/common/Helmet'
import Header from '../components/common/Header'
import { tvApi } from '../api'
import { Container } from './Home'
import Section from '../components/common/Section'
import Poster from '../components/common/Poster'
import Message from '../components/common/Message'
import { useQueries } from 'react-query'
import Loading from '../components/common/Loading'
import { IShow } from '../interface'
import Slider from '../components/common/Slider'

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
        <Slider
          data={topRated}
          title={'Top Rated Shows'}
          isError={isTopRatedError}
        />
        <Slider
          data={popular}
          title={'Popular Shows'}
          isError={isPopularError}
        />
        <Slider
          data={onTheAir}
          title={'On the Air Shows'}
          isError={isOnTheAirError}
        />
        <Slider
          data={airingToday}
          title={'Airing Today Shows'}
          isError={isAiringTodayError}
        />
      </Container>
    </>
  )
}

export default TV
