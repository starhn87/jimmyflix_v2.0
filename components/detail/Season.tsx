import React from 'react'
import {
  Box,
  CenteredItem,
  Logo,
  Name,
  Product,
  Wrapper,
} from '../../components/detail'
import { ISeason } from '../../interface'

interface SeasonProps {
  seasons: []
}

export default function Season({ seasons }: SeasonProps) {
  return (
    <>
      {seasons?.length > 0 && (
        <Box>
          <Wrapper>
            {seasons.map((season: ISeason) => (
              <CenteredItem key={season.id}>
                <Product>
                  <Logo
                    src={
                      season.poster_path
                        ? `https://image.tmdb.org/t/p/original${season.poster_path}`
                        : '/images/defaultPoster.png'
                    }
                    alt={season.name}
                  />
                </Product>
                <Name>
                  {season.name.length > 20
                    ? `${season.name.substring(0, 20)}...`
                    : season.name}
                </Name>
              </CenteredItem>
            ))}
          </Wrapper>
        </Box>
      )}
    </>
  )
}
