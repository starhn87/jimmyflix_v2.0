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

const Poster = ({
  id,
  imageUrl,
  title,
  rating,
  year,
  isMovie = false,
}: PosterProps) => (
  <Link href={isMovie ? `/movies/${id}` : `/tvs/${id}`}>
    <a>
      <Container>
        <ImageContainer>
          <Image
            src={
              imageUrl
                ? `https://image.tmdb.org/t/p/w300${imageUrl}`
                : '/images/defaultPoster.png'
            }
            alt={`${title} poster`}
          />
          <Rating>
            <span role="img" aria-label="rating">
              ⭐
            </span>{' '}
            {rating}/10
          </Rating>
        </ImageContainer>
        <Title>{title}</Title>
        <Year>{year}</Year>
      </Container>
    </a>
  </Link>
)

export default Poster

const Container = styled.div`
  width: 95%;
  font-size: 12px;
`

const Image = styled.img`
  display: block;
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 4px;
  transition: opacity 0.1s linear;
`

const Rating = styled.span`
  position: absolute;
  font-size: 16px;
  bottom: 7px;
  right: 7px;
  opacity: 0;
  transition: opacity 0.1s linear;
`

const ImageContainer = styled.div`
  position: relative;
  margin-bottom: 7px;
  &:hover {
    ${Image} {
      opacity: 0.2;
    }
    ${Rating} {
      opacity: 1;
    }
  }
`

const Title = styled.span`
  overflow: hidden;
  display: block;
  margin-bottom: 4px;
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Year = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
`
