import React from 'react'
import Message from '../common/Message'
import { collections } from '../../pages/api'
import { useQuery } from 'react-query'
import Infos from '../common/Infos'

interface CollectionProps {
  id: number
}

const Collection = ({ id }: CollectionProps) => {
  const { data = [], isError, isLoading, isFetching, refetch } = useQuery(
    ['collection', id],
    () => collections(id),
  )

  if (!isLoading && !isError && data.length === 0) {
    return <Message color="#eee" text="No collection titles found." />
  }

  return (
    <Infos
      slider={false}
      data={data}
      title="Collection titles"
      isError={isError}
      isLoading={isLoading}
      isFetching={isFetching}
      onRetry={() => void refetch()}
    />
  )
}

export default Collection
