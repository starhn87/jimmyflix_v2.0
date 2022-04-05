import React from 'react'
import { Box, Logo, Name, Product, Wrapper } from '../../Routes/Detail'
import defaultPersonImg from '../../assets/images/noPersonSmall.png'
import Message from '../Message'

interface CreditProps {
  cast: [] | null
}

export default function Credit({ cast }: CreditProps) {
  return (
    <>
      {cast && cast.length > 0 && (
        <Box>
          <Wrapper>
            {cast.map(
              (
                profile: {
                  profile_path: string
                  original_name: string
                  character: string
                },
                index: number,
              ) => (
                <div key={index}>
                  <Product>
                    <Logo
                      src={
                        profile.profile_path
                          ? `https://image.tmdb.org/t/p/original${profile.profile_path}`
                          : defaultPersonImg
                      }
                      alt={profile.original_name}
                    />
                  </Product>
                  <Name>{profile.character}</Name>
                  <Name>({profile.original_name})</Name>
                </div>
              ),
            )}
          </Wrapper>
        </Box>
      )}
      {(!cast || cast.length === 0) && (
        <Message color="#eee" text={'No Credits Found'} />
      )}
    </>
  )
}
