import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { dehydrate, QueryClient, useQuery } from 'react-query'
import HelmetWrapper from '../../components/common/Helmet'
import Loading from '../../components/common/Loading'
import RequestError from '../../components/common/RequestError'
import Detail from '../../components/detail'
import { isClientReq } from '../../utils'
import { moviesApi } from '../api'

export default function MovieDetail() {
  const {
    query: { id },
  } = useRouter()
  const parsedId = Number(id)
  const { data, isError, isLoading, isFetching, refetch } = useQuery(
    ['movieDetail', parsedId],
    () => moviesApi.movieDetail(parsedId),
    {
      enabled: Number.isFinite(parsedId),
    },
  )

  if (isLoading || !data) {
    if (isError) {
      return (
        <>
          <HelmetWrapper content="Error | Jimmyflix" />
          <RequestError
            title="Couldn't load this movie"
            onRetry={() => void refetch()}
            isRetrying={isFetching}
            backHref="/"
            backLabel="Browse movies"
          />
        </>
      )
    }

    return <Loading label="Loading movie details…" />
  }

  return <Detail detail={data} id={parsedId} isMovie={true} />
}

export async function getServerSideProps({
  req: { url },
  query: { id },
}: GetServerSidePropsContext) {
  if (isClientReq(url)) {
    return {
      props: {},
    }
  }

  const parsedId = Number(id)
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(['movieDetail', parsedId], () =>
    moviesApi.movieDetail(parsedId),
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      id: parsedId,
    },
  }
}
