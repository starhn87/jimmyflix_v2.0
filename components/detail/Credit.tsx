import React from 'react'
import { Box, Logo, Name, Product, Wrapper } from '../detail'
import DefaultPerson from '../../public/images/defaultPerson.png'
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
  const { data, isError, isFetched } = useQuery(['credit', id], () => {
    if (isMovie) {
      return moviesApi.cast(id)
    } else {
      return tvApi.cast(id)
    }
  })

  if (!isFetched) {
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
                        : DefaultPerson.src
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
      {!isError && data.length === 0 && (
        <Message color="#eee" text={'No Credits Found'} />
      )}
    </>
  )
}
