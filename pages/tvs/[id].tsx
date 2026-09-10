import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { dehydrate, QueryClient, useQuery } from 'react-query'
import HelmetWrapper from '../../components/common/Helmet'
import Loading from '../../components/common/Loading'
import RequestError from '../../components/common/RequestError'
import Detail from '../../components/detail'
import { isClientReq } from '../../utils'
import { tvApi } from '../api'

export default function TvDetail() {
  const {
    query: { id },
  } = useRouter()
  const parsedId = Number(id)
  const { data, isError, isLoading, isFetching, refetch } = useQuery(
    ['tvDetail', parsedId],
    () => tvApi.showDetail(parsedId),
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
            title="Couldn't load this TV show"
            onRetry={() => void refetch()}
            isRetrying={isFetching}
            backHref="/tvs"
            backLabel="Browse TV shows"
          />
        </>
      )
    }

    return <Loading label="Loading TV show details…" />
  }

  return <Detail detail={data} id={parsedId} isMovie={false} />
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

  await queryClient.prefetchQuery(['tvDetail', parsedId], () =>
    tvApi.showDetail(parsedId),
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
