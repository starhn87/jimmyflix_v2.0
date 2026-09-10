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

const Container = styled.section`
  margin-top: 10px;

  :not(:last-child) {
    margin-bottom: 50px;
  }
`

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.35;
`

export const Grid = styled.div`
  display: grid;
  margin-top: 20px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 28px 20px;
  align-items: start;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px 16px;
  }
`

const Wrapper = styled.div`
  width: 96%;
  margin: 28px auto 35px;
`
