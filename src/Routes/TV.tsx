import React, { useEffect } from 'react'
import Helmet from '../Components/Helmet'
import Header from '../Components/Header'
<<<<<<< Updated upstream
import { shallowEqual } from 'react-redux'
import { reset, success, TVState } from '../redux/TVReducer'
import { useAppDispatch, useAppSelector } from '../redux/store'
import Loading from '../Components/Loading'
=======
import { success } from '../redux/reducers/TVReducer'
import { useAppDispatch, useAppSelector } from '../redux/store'
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  const loading = useAppSelector(
    (state: TVProps) => state.tv.loading,
    shallowEqual,
=======
  const { topRated, popular, airingToday, error } = useAppSelector(
    (state: TVProps) => ({ ...state.tv }),
>>>>>>> Stashed changes
  )
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

    return () => {
      dispatch(reset())
    }
  }, [])

  return (
    <>
      <Helmet content="TV Shows | Jimmyflix" />
      <Header />
<<<<<<< Updated upstream
      {loading ? <Loading /> : <TVResult />}
=======
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
>>>>>>> Stashed changes
    </>
  )
}

export default TV
