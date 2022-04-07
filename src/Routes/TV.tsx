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

export function TV() {
  const [
    { data: topRated, isFetched: isTopRatedFetched, isError: isTopRatedError },
    { data: popular, isFetched: isPopularFetched, isError: isPopularError },
    {
      data: airingToday,
      isFetched: isAiringTodayFetched,
      isError: isAiringTodayError,
    },
  ] = useQueries([
    {
      queryKey: ['topRated'],
      queryFn: () => tvApi.topRated(),
    },
    {
      queryKey: ['popularTV'],
      queryFn: () => tvApi.popular(),
    },
    {
      queryKey: ['airingToday'],
      queryFn: () => tvApi.airingToday(),
    },
  ])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!isTopRatedFetched || !isPopularFetched || !isAiringTodayFetched) {
    return <Loading />
  }

  return (
    <>
      <Helmet content="TV Shows | Jimmyflix" />
      <Header />
      <Container>
        {topRated.length > 0 && (
          <Section slide={true} title="Top Rated Shows">
            {topRated.map((show: IShow) => (
              <Poster
                key={show.id}
                id={show.id}
                imageUrl={show.poster_path}
                title={show.name}
                rating={show.vote_average}
                year={
                  show.first_air_date && show.first_air_date.substring(0, 4)
                }
              />
            ))}
          </Section>
        )}
        {popular.length > 0 && (
          <Section slide={true} title="Popular Shows">
            {popular.map((show: IShow) => (
              <Poster
                key={show.id}
                id={show.id}
                imageUrl={show.poster_path}
                title={show.name}
                rating={show.vote_average}
                year={
                  show.first_air_date && show.first_air_date.substring(0, 4)
                }
              />
            ))}
          </Section>
        )}
        {airingToday.length > 0 && (
          <Section slide={true} title="Airing Today Shows">
            {airingToday.map((show: IShow) => (
              <Poster
                key={show.id}
                id={show.id}
                imageUrl={show.poster_path}
                title={show.name}
                rating={show.vote_average}
                year={
                  show.first_air_date && show.first_air_date.substring(0, 4)
                }
              />
            ))}
          </Section>
        )}
        {isTopRatedError && (
          <Message color="#e74c3c" text={'Error in top rated.'} />
        )}
        {isPopularError && (
          <Message color="#e74c3c" text={'Error in popular.'} />
        )}
        {isAiringTodayError && (
          <Message color="#e74c3c" text={'Error in airing today.'} />
        )}
      </Container>
    </>
  )
}

export default TV
