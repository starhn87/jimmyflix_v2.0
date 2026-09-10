import React, { memo } from 'react'
import styled from '@emotion/styled'

interface Genre {
  name: string
}

interface InfoProps {
  vote_average?: number
  release_date?: string
  first_air_date?: string
  episode_run_time?: number[]
  genres?: Genre[]
  runtime?: number
}

export default memo(function Info({
  vote_average,
  release_date,
  first_air_date,
  runtime,
  episode_run_time,
  genres,
}: InfoProps) {
  const rating =
    Number.isFinite(vote_average) && Number(vote_average) > 0
      ? Number(vote_average).toFixed(1)
      : null
  const year = (release_date || first_air_date)?.substring(0, 4)
  const duration = runtime || episode_run_time?.find((time) => time > 0)
  const genreNames = genres?.map((genre) => genre.name).filter(Boolean)

  return (
    <Metadata aria-label="Title details">
      <MetadataItem aria-label={rating ? `Rating ${rating} out of 10` : 'Not rated'}>
        <span aria-hidden="true">★</span>
        {rating ? `${rating}/10` : 'Not rated'}
      </MetadataItem>
      {year ? <MetadataItem>{year}</MetadataItem> : null}
      {duration ? <MetadataItem>{duration} min</MetadataItem> : null}
      {genreNames && genreNames.length > 0 ? (
        <GenreItem>{genreNames.join(' · ')}</GenreItem>
      ) : null}
    </Metadata>
  )
})

const Metadata = styled.ul`
  display: flex;
  margin: 16px 0 0;
  padding: 0;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
`

const MetadataItem = styled.li`
  display: inline-flex;
  min-height: 30px;
  padding: 5px 10px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(20, 20, 20, 0.62);
  font-size: 13px;
  line-height: 1.35;
`

const GenreItem = styled(MetadataItem)`
  border-color: rgba(77, 150, 251, 0.32);
  color: #bed9ff;
`
