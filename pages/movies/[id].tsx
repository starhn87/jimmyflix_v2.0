import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { dehydrate, QueryClient, useQuery } from 'react-query'
import HelmetWrapper from '../../components/common/Helmet'
import Loading from '../../components/common/Loading'
import Message from '../../components/common/Message'
import Detail from '../../components/detail'
import { isClientReq } from '../../utils'
import { moviesApi } from '../api'

export default function MovieDetail() {
  const {
    query: { id },
  } = useRouter()
  const parsedId = Number(id)
  const { data, isError, isFetching } = useQuery(
    ['movieDetail', parsedId],
    () => moviesApi.movieDetail(parsedId),
  )

  if (isFetching) {
    return <Loading />
  }

  if (isError) {
    return (
      <>
        <HelmetWrapper content="Error | Jimmyflix" />
        <Message color="#e74c3c" text={'Error in detail'}></Message>
      </>
    )
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
