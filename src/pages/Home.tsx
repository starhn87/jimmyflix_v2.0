import React, { useEffect } from 'react'
import { moviesApi } from '../api'
import styled from 'styled-components'
import Section from '../component/common/Section'
import Poster from '../component/common/Poster'
import Message from '../component/common/Message'
import { IMovie } from '../interface'
import { useQueries } from 'react-query'
import Loading from '../component/common/Loading'
import HelmetWrapper from '../component/common/Helmet'

function Home() {
  const [
    {
      data: nowPlaying,
      isFetched: isNowPlayingFetched,
      isError: isNowPlayingError,
    },
    { data: upcoming, isFetched: isUpcomingFetched, isError: isUpcomingError },
    { data: popular, isFetched: isPopularFetched, isError: isPopularError },
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

  if (!isNowPlayingFetched || !isUpcomingFetched || !isPopularFetched) {
    return <Loading />
  }

  return (
    <>
      <HelmetWrapper content="Movies | Jimmyflix" />
      <Container>
        {nowPlaying.length > 0 && (
          <Section slide={true} title="Now Playing">
            {nowPlaying.map((movie: IMovie) => (
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
            {upcoming.map((movie: IMovie) => (
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
            {popular.map((movie: IMovie) => (
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
        {isNowPlayingError && (
          <Message color="#e74c3c" text={'Error in now playing.'} />
        )}
        {isUpcomingError && (
          <Message color="#e74c3c" text={'Error in upcoming.'} />
        )}
        {isPopularError && (
          <Message color="#e74c3c" text={'Error in popular'} />
        )}
      </Container>
    </>
  )
}

export default Home

export const Container = styled.div`
  padding: 20px;
`
