import React from 'react'
import { Box, CenteredItem, Logo, Name, Product, Wrapper } from '../detail'
import Message from '../common/Message'
import { useQuery } from 'react-query'
import { moviesApi, tvApi } from '../../pages/api'
import { IProfile } from '../../interface'
import Loading from '../common/Loading'
import RequestError from '../common/RequestError'

interface CreditProps {
  isMovie: boolean
  id: number
}

export default function Credit({ isMovie, id }: CreditProps) {
  const mediaType = isMovie ? 'movie' : 'tv'
  const { data, isError, isLoading, isFetching, refetch } = useQuery(
    ['credit', mediaType, id],
    () => (isMovie ? moviesApi.cast(id) : tvApi.cast(id)),
  )

  if (isLoading && !data) {
    return <Loading fullPage={false} label="Loading credits…" />
  }

  if (isError && !data) {
    return (
      <RequestError
        compact
        title="Couldn't load credits"
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    )
  }

  return (
    <>
      {data?.length > 0 && (
        <Box>
          <Wrapper>
            {data.map((profile: IProfile) => (
              <CenteredItem key={profile.id}>
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
              </CenteredItem>
            ))}
          </Wrapper>
        </Box>
      )}
      {!isError && data?.length === 0 && (
        <Message color="#eee" text={'No Credits Found'} />
      )}
      {isError && data && (
        <RequestError
          compact
          title="Couldn't refresh credits"
          message="The existing credits are still available."
          onRetry={() => void refetch()}
          isRetrying={isFetching}
        />
      )}
    </>
  )
}
