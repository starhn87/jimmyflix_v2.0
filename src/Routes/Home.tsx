import React, { useEffect } from 'react'
import Helmet from '../Components/Helmet'
import { moviesApi } from '../api'
import styled from 'styled-components'
import Section from '../Components/Section'
import Poster from '../Components/Poster'
import Message from '../Components/Message'
import { Movie } from '../interface'
import { useQueries } from 'react-query'
import Loading from '../Components/Loading'

function Home() {
  const [
    { data: nowPlaying, isError: error1 },
    { data: upcoming, isError: error2 },
    { data: popular, isError: error3 },
  ] = useQueries([
    {
      queryKey: ['nowPlaying'],
      queryFn: () => moviesApi.nowPlaying(),
    },
    {
      queryKey: ['upcoming'],
      queryFn: () => moviesApi.upcoming(),
    },
    {
      queryKey: ['popularMovie'],
      queryFn: () => moviesApi.popular(),
    },
  ])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!nowPlaying || !upcoming || !popular) {
    return <Loading />
  }

  return (
    <>
      <Helmet content="Movies | Jimmyflix" />
      <Container>
        {nowPlaying.length > 0 && (
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
        {upcoming.length > 0 && (
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
        {popular.length > 0 && (
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
        {error1 && <Message color="#e74c3c" text={'Error in now playing.'} />}
        {error2 && <Message color="#e74c3c" text={'Error in upcoming.'} />}
        {error3 && <Message color="#e74c3c" text={'Error in popular'} />}
      </Container>
    </>
  )
}

export default Home

export const Container = styled.div`
  padding: 20px;
`
