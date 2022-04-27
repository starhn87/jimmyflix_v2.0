import React from 'react'
import Message from '../common/Message'
import { collections } from '../../pages/api'
import { useQuery } from 'react-query'
import Infos from '../common/Infos'
import Loading from '../common/Loading'

interface CollectionProps {
  id: number
}

const Collection = ({ id }: CollectionProps) => {
  const { data, isError, isFetched } = useQuery(['collection', id], () =>
    collections(id),
  )

  if (!isFetched) {
    return <Loading />
  }

  return isError ? (
    <Message color="#e74c3c" text={'Error in collection.'}></Message>
  ) : (
    <Infos slider={false} data={data} isError={isError} />
  )
}

export default Collection
