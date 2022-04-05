import React from 'react'
import { Box, Logo, Name, Product, Wrapper } from '../../Routes/Detail'
import defaultPosterImg from '../../assets/images/noPosterSmall.png'

interface SeasonProps {
  seasons: []
}

export default function Season({ seasons }: SeasonProps) {
  return (
    <>
      {seasons && seasons.length > 0 && (
        <Box>
          <Wrapper>
            {seasons.map(
              (
                season: { poster_path: string; name: string },
                index: number,
              ) => (
                <div key={index}>
                  <Product>
                    <Logo
                      src={
                        season.poster_path
                          ? `https://image.tmdb.org/t/p/original${season.poster_path}`
                          : defaultPosterImg
                      }
                      alt={season.name}
                    />
                  </Product>
                  <Name>
                    {season.name.length > 20
                      ? `${season.name.substring(0, 20)}...`
                      : season.name}
                  </Name>
                </div>
              ),
            )}
          </Wrapper>
        </Box>
      )}
    </>
  )
}
