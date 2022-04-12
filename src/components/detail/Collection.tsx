import React, { Dispatch, SetStateAction } from 'react'
import Message from '../common/Message'
import Section from '../common/Section'
import Poster from '../common/Poster'
import { collections } from '../../api'
import { ICollection, TabType } from '../../interface'
import { useQuery } from 'react-query'
import { Box } from '../../pages/Detail'

interface CollectionProps {
  id: number
  onClick: Dispatch<SetStateAction<TabType>>
}

const Collection = ({ id, onClick }: CollectionProps) => {
  const { data, isError } = useQuery(['collection', id], () => collections(id))

  return isError ? (
    <Message color="#e74c3c" text={'Error in collection.'}></Message>
  ) : (
    <Box>
      <Section slide={false}>
        {data &&
          data.length > 0 &&
          data
            .filter((collection: ICollection) => collection.release_date !== '')
            .map((collection: ICollection) => (
              <Poster
                key={collection.id}
                id={collection.id}
                imageUrl={collection.poster_path}
                title={collection.title}
                rating={collection.vote_average}
                year={''}
                isMovie={true}
                onClick={() => onClick('Trailer')}
              />
            ))}
      </Section>
    </Box>
  )
}

export default Collection
