import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { dehydrate, QueryClient, useQuery } from 'react-query'
import HelmetWrapper from '../../components/common/Helmet'
import Loading from '../../components/common/Loading'
import Message from '../../components/common/Message'
import Detail from '../../components/detail'
import { isClientReq } from '../../utils'
import { tvApi } from '../api'

export default function TvDetail() {
  const {
    query: { id },
  } = useRouter()
  const parsedId = Number(id)
  const { data, isError, isFetching } = useQuery(['tvDetail', parsedId], () =>
    tvApi.showDetail(parsedId),
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
