import React from 'react'
import { Box, Logo, Name, Product, Wrapper } from '../detail'
import Message from '../common/Message'
import { useQuery } from 'react-query'
import { moviesApi, tvApi } from '../../pages/api'
import { IProfile } from '../../interface'
import Loading from '../common/Loading'

interface CreditProps {
  isMovie: boolean
  id: number
}

export default function Credit({ isMovie, id }: CreditProps) {
  const mediaType = isMovie ? 'movie' : 'tv'
  const { data, isError, isFetching } = useQuery(
    ['credit', mediaType, id],
    () => (isMovie ? moviesApi.cast(id) : tvApi.cast(id)),
  )

  if (isFetching) {
    return <Loading />
  }

  return (
    <>
      {data?.length > 0 && (
        <Box>
          <Wrapper>
            {data.map((profile: IProfile) => (
              <div key={profile.id}>
                <Product>
                  <Logo
                    src={
                      profile.profile_path
                        ? `https://image.tmdb.org/t/p/original${profile.profile_path}`
                        : '/images/defaultPerson.png'
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
      {isError && <Message color="#e74c3c" text={'Error in credits.'} />}
      {!isError && data?.length === 0 && (
        <Message color="#eee" text={'No Credits Found'} />
      )}
    </>
  )
}
