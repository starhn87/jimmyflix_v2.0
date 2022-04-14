import React, { Dispatch, SetStateAction } from 'react'
import Message from '../common/Message'
import Section from '../common/Section'
import Poster from '../common/Poster'
import { collections } from '../../api'
import { ICollection, TabType } from '../../interface'
import { useQuery } from 'react-query'
import { Box } from '../../pages/Detail'
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
