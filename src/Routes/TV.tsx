import React, { useEffect } from 'react'
import Helmet from '../Components/Helmet'
import Header from '../Components/Header'
<<<<<<< HEAD
import { success } from '../redux/TVReducer'
import { useAppDispatch, useAppSelector } from '../redux/store'
=======
import { reset, success, TVState } from '../redux/reducers/TVReducer'
import { useAppDispatch } from '../redux/store'
>>>>>>> dev
import { tvApi } from '../api'
import { Container } from './Home'
import Section from '../Components/Section'
import Poster from '../Components/Poster'
import Message from '../Components/Message'
import { TVState } from '../interface'

export interface TVProps {
  tv: TVState
}

export interface Show {
  id: number
  poster_path: string
  name: string
  vote_average: number
  first_air_date: string
}

export function TV() {
<<<<<<< HEAD
  const { topRated, popular, airingToday, error } = useAppSelector(
    (state: TVProps) => ({ ...state.tv }),
  )
=======
>>>>>>> dev
  const dispatch = useAppDispatch()

  const getTV = async () => {
    try {
      const {
        data: { results: topRated },
      } = await tvApi.topRated()
      const {
        data: { results: popular },
      } = await tvApi.popular()
      const {
        data: { results: airingToday },
      } = await tvApi.airingToday()
      dispatch(success({ topRated, popular, airingToday }))
    } catch {
      dispatch(fail())
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    getTV()
  }, [])

  return (
    <>
      <Helmet content="TV Shows | Jimmyflix" />
      <Header />
<<<<<<< HEAD
      <Container>
        {topRated && topRated.length > 0 && (
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
        {popular && popular.length > 0 && (
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
        {airingToday && airingToday.length > 0 && (
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
        {error && <Message color="#e74c3c" text={error} />}
      </Container>
=======
      <TVResult />
>>>>>>> dev
    </>
  )
}

export default TV
