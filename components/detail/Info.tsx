import React, { memo } from 'react'
import styled from '@emotion/styled'

interface InfoProps {
  vote_average: number
  release_date: string
  first_air_date: string
  episode_run_time: number[]
  genres: []
  overview: string
  runtime?: number
}

export default memo(function Info({
  vote_average,
  release_date,
  first_air_date,
  runtime,
  episode_run_time,
  genres,
  overview,
}: InfoProps) {
  return (
    <>
      <ItemContainer>
        <Rating>
          <span role="img" aria-label="rating">
            ⭐
          </span>
          &nbsp;
          {vote_average}/10
        </Rating>
        {(release_date || first_air_date) && (
          <>
            <Divider>•</Divider>
            <Item>
              {release_date
                ? release_date.substring(0, 4)
                : first_air_date.substring(0, 4)}
            </Item>
          </>
        )}
        {runtime ? (
          <>
            <Divider>•</Divider>
            <Item>{runtime} min</Item>
          </>
        ) : null}
        {episode_run_time?.length > 0 ? (
          <>
            <Divider>•</Divider>
            <Item>{episode_run_time[0]} min</Item>
          </>
        ) : null}
        {genres && (
          <>
            <Divider>•</Divider>
            <Item>
              {genres.map((genre: { name: string }, index: number) =>
                index === genres.length - 1 ? genre.name : `${genre.name} / `,
              )}
            </Item>
          </>
        )}
      </ItemContainer>
      <Overview>{overview}</Overview>
    </>
  )
})

const Rating = styled.span`
  display: inline-flex;
`

const ItemContainer = styled.div`
  margin: 15px 0;
  line-height: 20px;

  @media (max-width: 768px) {
    width: 95%;
    margin: 0;
    padding: 0 1% 3%;
  }
`

const Item = styled.span``

const Divider = styled.span`
  margin: 0 10px;
`

const Overview = styled.p`
  line-height: 1.5;
  font-size: 12px;
  opacity: 0.7;

  @media (max-width: 768px) {
    width: 95%;
  }
`
