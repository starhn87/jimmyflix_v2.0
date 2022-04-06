import React, { useEffect } from 'react'
import Helmet from '../Components/Helmet'
import Header from '../Components/Header'
import { tvApi } from '../api'
import { Container } from './Home'
import Section from '../Components/Section'
import Poster from '../Components/Poster'
import Message from '../Components/Message'
import { useQueries } from 'react-query'
import Loading from '../Components/Loading'
import { Show } from '../interface'

export function TV() {
  const [
    { data: topRated, isError: error1 },
    { data: popular, isError: error2 },
    { data: airingToday, isError: error3 },
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

  if (!topRated || !popular || !airingToday) {
    return <Loading />
  }

  return (
    <>
      <Helmet content="TV Shows | Jimmyflix" />
      <Header />
      <Container>
        {topRated.length > 0 && (
          <Section slide={true} title="Top Rated Shows">
            {topRated.map((show: Show) => (
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
            {popular.map((show: Show) => (
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
            {airingToday.map((show: Show) => (
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
        {error1 && <Message color="#e74c3c" text={'Error in top rated.'} />}
        {error2 && <Message color="#e74c3c" text={'Error in popular.'} />}
        {error3 && <Message color="#e74c3c" text={'Error in airing today.'} />}
      </Container>
    </>
  )
}

export default TV
