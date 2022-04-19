import React from 'react'
import Message from '../common/Message'
import { collections } from '../../api'
import { useQuery } from 'react-query'
import Infos from '../common/Infos'

interface CollectionProps {
  id: number
}

const Collection = ({ id }: CollectionProps) => {
  const { data, isError } = useQuery(['collection', id], () => collections(id))

  return isError ? (
    <Message color="#e74c3c" text={'Error in collection.'}></Message>
  ) : (
    <Infos slider={false} data={data} isError={isError} />
  )
}

export default Collection
