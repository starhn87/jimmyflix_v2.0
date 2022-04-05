import React, { useEffect } from 'react'
import Helmet from '../Components/Helmet'
<<<<<<< HEAD
import { shallowEqual, useDispatch } from 'react-redux'
import { success } from '../redux/HomeReducer'
=======
import MovieResult from '../Components/MovieResult'
import { useDispatch } from 'react-redux'
import { reset, success } from '../redux/reducers/HomeReducer'
>>>>>>> dev
import { moviesApi } from '../api'
import { useAppSelector } from '../redux/store'
import styled from 'styled-components'
import Section from '../Components/Section'
import Poster from '../Components/Poster'
import Message from '../Components/Message'
import { HomeState, Movie } from '../interface'

interface HomeProps {
  home: HomeState
}

function Home() {
<<<<<<< HEAD
  const { nowPlaying, upcoming, popular, error } = useAppSelector(
    (state: HomeProps) => ({ ...state.home }),
    shallowEqual,
  )
=======
>>>>>>> dev
  const dispatch = useDispatch()

  const getHome = async () => {
    try {
      const {
        data: { results: nowPlaying },
      } = await moviesApi.nowPlaying()
      const {
        data: { results: upcoming },
      } = await moviesApi.upcoming()
      const {
        data: { results: popular },
      } = await moviesApi.popular()
      dispatch(success({ nowPlaying, upcoming, popular }))
    } catch {
      dispatch(fail())
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    getHome()
  }, [])

  return (
    <>
      <Helmet content="Movies | Jimmyflix" />
<<<<<<< HEAD
      <Container>
        {nowPlaying && nowPlaying.length > 0 && (
          <Section slide={true} title="Now Playing">
            {nowPlaying.map((movie: Movie) => (
              <Poster
                key={movie.id}
                id={movie.id}
                imageUrl={movie.poster_path}
                title={movie.title}
                rating={movie.vote_average}
                year={movie.release_date && movie.release_date.substring(0, 4)}
                isMovie={true}
              />
            ))}
          </Section>
        )}
        {upcoming && upcoming.length > 0 && (
          <Section slide={true} title="Upcoming Movies">
            {upcoming.map((movie: Movie) => (
              <Poster
                key={movie.id}
                id={movie.id}
                imageUrl={movie.poster_path}
                title={movie.title}
                rating={movie.vote_average}
                year={movie.release_date && movie.release_date.substring(0, 4)}
                isMovie={true}
              />
            ))}
          </Section>
        )}
        {popular && popular.length > 0 && (
          <Section slide={true} title="Popular Movies">
            {popular.map((movie: Movie) => (
              <Poster
                key={movie.id}
                id={movie.id}
                imageUrl={movie.poster_path}
                title={movie.title}
                rating={movie.vote_average}
                year={movie.release_date && movie.release_date.substring(0, 4)}
                isMovie={true}
              />
            ))}
          </Section>
        )}
        {error && <Message color="#e74c3c" text={error} />}
      </Container>
=======
      <MovieResult />
>>>>>>> dev
    </>
  )
}

export default Home

export const Container = styled.div`
  padding: 20px;
`
