import Link from 'next/link'
import React from 'react'
import styled from '@emotion/styled'

interface PosterProps {
  id: number
  imageUrl: string
  title: string
  rating: number
  year: string
  isMovie?: boolean
}

const getRating = (rating: number) => {
  if (!Number.isFinite(rating) || rating <= 0) {
    return {
      label: 'Not rated',
      value: 'NR',
    }
  }

  const value = rating.toFixed(1)

  return {
    label: `Rating ${value} out of 10`,
    value,
  }
}

const Poster = ({
  id,
  imageUrl,
  title,
  rating,
  year,
  isMovie = false,
}: PosterProps) => {
  const displayTitle = title || 'Untitled'
  const ratingInfo = getRating(rating)
  const mediaLabel = isMovie ? 'Movie' : 'TV show'
  const cardLabel = [displayTitle, mediaLabel, year, ratingInfo.label]
    .filter(Boolean)
    .join(', ')

  return (
    <Link href={isMovie ? `/movies/${id}` : `/tvs/${id}`} passHref>
      <CardLink aria-label={cardLabel}>
        <Container>
          <ImageContainer>
            <Image
              src={
                imageUrl
                  ? `https://image.tmdb.org/t/p/w300${imageUrl}`
                  : '/images/defaultPoster.png'
              }
              alt={`${displayTitle} poster`}
            />
            <Rating aria-label={ratingInfo.label}>
              <span aria-hidden="true">★</span>
              {ratingInfo.value}
            </Rating>
          </ImageContainer>
          <Title title={displayTitle}>{displayTitle}</Title>
          <Metadata>
            <Year>{year || 'Year unknown'}</Year>
            <MediaType>{isMovie ? 'Movie' : 'TV'}</MediaType>
          </Metadata>
        </Container>
      </CardLink>
    </Link>
  )
}

export default Poster

const CardLink = styled.a`
  display: block;
  min-width: 0;
  border-radius: 8px;

  &:focus-visible {
    outline: 3px solid rgba(77, 150, 251, 0.75);
    outline-offset: 4px;
  }

  &:hover img,
  &:focus-visible img {
    transform: scale(1.025);
  }
`

const Container = styled.article`
  min-width: 0;
  width: 100%;
  font-size: 12px;
`

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 8px;
  background: #242424;
`

const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.18s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const Rating = styled.span`
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: inline-flex;
  min-height: 28px;
  padding: 0 8px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  align-items: center;
  gap: 4px;
  color: #fff;
  background: rgba(8, 8, 8, 0.86);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
`

const Title = styled.h3`
  display: -webkit-box;
  overflow: hidden;
  min-height: 2.7em;
  margin: 10px 0 6px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`

const Metadata = styled.p`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.4;
`

const Year = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const MediaType = styled.span`
  flex: none;
  color: rgba(142, 190, 255, 0.92);
`
