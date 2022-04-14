import React from 'react'
import { Box, Logo, Name, Product, Wrapper } from '../../pages/Detail'
import DefaultPerson from '../../assets/images/noPersonSmall.png'
import Message from '../common/Message'
import { useQuery } from 'react-query'
import { moviesApi, tvApi } from '../../api'
import { IProfile } from '../../interface'

interface CreditProps {
  isMovie: boolean
  parsedId: number
}

export default function Credit({ isMovie, parsedId }: CreditProps) {
  const { data, isError } = useQuery(['credit', parsedId], () => {
    if (isMovie) {
      return moviesApi.cast(parsedId)
    } else {
      return tvApi.cast(parsedId)
    }
  })

  return (
    <>
      {data && data.length > 0 && (
        <Box>
          <Wrapper>
            {data.map((profile: IProfile) => (
              <div key={profile.id}>
                <Product>
                  <Logo
                    src={
                      profile.profile_path
                        ? `https://image.tmdb.org/t/p/original${profile.profile_path}`
                        : DefaultPerson
                    }
                    alt={profile.original_name}
                  />
                </Product>
                <Name>{profile.character}</Name>
                <Name>({profile.original_name})</Name>
              </div>
            ))}
          </Wrapper>
        </Box>
      )}
      {!isError && data.length === 0 && (
        <Message color="#eee" text={'No Credits Found'} />
      )}
      {isError && <Message color="#e74c3c" text={'Error in credits.'} />}
    </>
  )
}
