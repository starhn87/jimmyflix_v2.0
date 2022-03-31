import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Message from './Message'
import Poster from './Poster'
import Section from './Section'
import { TVProps } from '../Routes/TV'

const Container = styled.div`
  padding: 20px;
`

export interface Show {
  id: number
  poster_path: string
  name: string
  vote_average: number
  first_air_date: string
}

function TVResult() {
  const { topRated, popular, airingToday, error } = useSelector(
    (state: TVProps) => ({ ...state.tv }),
  )

  return (
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
              year={show.first_air_date && show.first_air_date.substring(0, 4)}
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
              year={show.first_air_date && show.first_air_date.substring(0, 4)}
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
              year={show.first_air_date && show.first_air_date.substring(0, 4)}
            />
          ))}
        </Section>
      )}
      {error && <Message color="#e74c3c" text={error} />}
    </Container>
  )
}

export default TVResult
