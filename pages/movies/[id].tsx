import { GetServerSidePropsContext } from 'next'
import { dehydrate, QueryClient, useQuery } from 'react-query'
import HelmetWrapper from '../../components/common/Helmet'
import Loading from '../../components/common/Loading'
import Message from '../../components/common/Message'
import Detail from '../../components/detail'
import { isClientReq } from '../../utils'
import { moviesApi } from '../api'

export interface DetailProps {
  id: number
}

export default function MovieDetail({ id }: DetailProps) {
  const { data, isError, isFetching } = useQuery(['movieDetail', id], () =>
    moviesApi.movieDetail(id),
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

  return <Detail detail={data} id={id} isMovie={true} />
}

export async function getServerSideProps({
  req,
  query: { id },
}: GetServerSidePropsContext) {
  const isClient = isClientReq(req)
  const parsedId = Number(id)

  if (isClient) {
    return {
      props: {
        id: parsedId,
      },
    }
  }

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
