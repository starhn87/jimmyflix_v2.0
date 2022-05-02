import { GetServerSidePropsContext } from 'next'
import { dehydrate, QueryClient, useQuery } from 'react-query'
import HelmetWrapper from '../../components/common/Helmet'
import Loading from '../../components/common/Loading'
import Message from '../../components/common/Message'
import Detail from '../../components/detail'
import { isClientReq } from '../../utils'
import { tvApi } from '../api'
import { DetailProps } from '../movies/[id]'

export default function TvDetail({ id }: DetailProps) {
  const { data, isError, isFetching } = useQuery(['tvDetail', id], () =>
    tvApi.showDetail(id),
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

  return <Detail detail={data} id={id} isMovie={false} />
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

  await queryClient.prefetchQuery(['tvDetail', parsedId], () =>
    tvApi.showDetail(parsedId),
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      id: parsedId,
    },
  }
}
