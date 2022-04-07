import React, { Dispatch, SetStateAction } from 'react'
import Message from '../common/Message'
import Section from '../common/Section'
import styled from 'styled-components'
import Poster from '../common/Poster'
import { collections } from '../../api'
import { ICollection, TabType } from '../../interface'
import { useQuery } from 'react-query'
import Loading from '../common/Loading'

interface CollectionProps {
  id: number
  onClick: Dispatch<SetStateAction<TabType>>
}

const Collection = ({ id, onClick }: CollectionProps) => {
  const { data, isFetched, isError } = useQuery(['collection', id], () =>
    collections(id),
  )

  if (!isFetched) {
    return <Loading />
  }

  return isError ? (
    <Message color="#e74c3c" text={'Error in collection.'}></Message>
  ) : (
    <Container>
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
    </Container>
  )
}

export default Collection

const Container = styled.div`
  margin-bottom: 30px;
  margin-top: 20px;
`
