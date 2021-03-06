import React, { ReactNode } from 'react'
import styled from '@emotion/styled'
import Slider from 'react-slick'

interface SectionProps {
  slide: boolean
  title?: string
  children: ReactNode
}

const Section = ({ slide, title, children }: SectionProps) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 9,
    slidesToScroll: 9,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 7,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        },
      },
      {
        breakpoint: 720,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <Container>
      {title && <Title>{title}</Title>}
      {slide ? (
        <Wrapper>
          <Slider {...settings}>{children}</Slider>
        </Wrapper>
      ) : (
        <Grid>{children}</Grid>
      )}
    </Container>
  )
}

export default Section

const Container = styled.div`
  margin-top: 10px;
  :not(:last-child) {
    margin-bottom: 50px;
  }
`

const Title = styled.span`
  font-size: 20px;
  font-weight: 600;
`

export const Grid = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 150px);
  grid-gap: 25px;
`

const Wrapper = styled.div`
  margin: 35px auto;
  width: 95%;
`
