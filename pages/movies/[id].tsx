import { GetServerSidePropsContext } from 'next'
import { useQuery } from 'react-query'
import HelmetWrapper from '../../components/common/Helmet'
import Loading from '../../components/common/Loading'
import Message from '../../components/common/Message'
import Detail from '../../components/detail'
import { isClientReq } from '../../utils'
import { moviesApi } from '../api'

export interface DetailProps {
  detail: any
  id: number
}

export default function MovieDetail({ detail, id }: DetailProps) {
  if (detail) {
    return <Detail detail={detail} id={id} isMovie={true} />
  }

  const { data, isError, isFetched } = useQuery(['movieDetail', id], () =>
    moviesApi.movieDetail(id),
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

  const detail = await moviesApi.movieDetail(parsedId)

  return {
    props: {
      detail,
      id: parsedId,
    },
  }
}
