import { GetServerSidePropsContext } from 'next'
import { useQuery } from 'react-query'
import HelmetWrapper from '../../components/common/Helmet'
import Loading from '../../components/common/Loading'
import Message from '../../components/common/Message'
import Detail from '../../components/detail'
import { isClientReq } from '../../utils'
import { tvApi } from '../api'
import { DetailProps } from '../movies/[id]'

export default function TvDetail({ detail, id }: DetailProps) {
  if (detail) {
    return <Detail detail={detail} id={id} isMovie={false} />
  }

  const { data, isError, isFetched } = useQuery(['tvDetail', id], () =>
    tvApi.showDetail(id),
  )

  if (!isFetched) {
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

  const detail = await tvApi.showDetail(parsedId)

  return {
    props: {
      detail,
      id: parsedId,
    },
  }
}
