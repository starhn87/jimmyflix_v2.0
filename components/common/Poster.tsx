import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import DefaultPoster from '../../public/images/noPosterSmall.png'

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
            bgUrl={
              imageUrl
                ? `https://image.tmdb.org/t/p/w300${imageUrl}`
                : DefaultPoster.src
            }
          />
          <Rating>
            <span role="img" aria-label="rating">
              ⭐
            </span>{' '}
            {rating}/10
          </Rating>
        </ImageContainer>
        <Title>
          {title.length > 15 ? `${title.substring(0, 15)}...` : title}
        </Title>
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

const Image = styled.div<{ bgUrl: string }>`
  height: 220px;
  background-image: url(${(props) => props.bgUrl});
  background-size: cover;
  border-radius: 4px;
  background-position: center center;
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
  display: block;
  font-size: 15px;
  margin-bottom: 4px;
`

const Year = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
`
