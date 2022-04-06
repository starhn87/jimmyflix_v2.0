import React, { useEffect, useState } from 'react'
import Message from '../Components/Message'
import Section from '../Components/Section'
import styled from 'styled-components'
import Poster from '../Components/Poster'
import { collections } from '../api'
import { ICollection } from '../interface'

interface CollectionProps {
  id: number
}

const Collection = ({ id }: CollectionProps) => {
  const [collection, setCollection] = useState<ICollection[]>()
  const [error, setError] = useState<string>()

  const getCollection = async () => {
    try {
      const {
        data: { parts },
      } = await collections(id)
      setCollection(parts)
    } catch {
      setError("Can't find collections information.")
    }
  }

  useEffect(() => {
    getCollection()
  }, [])

  return error ? (
    <Message color="#e74c3c" text={error}></Message>
  ) : (
    <Container>
      <Section slide={false}>
        {collection &&
          collection.length > 0 &&
          collection
            .filter((movie) => movie.release_date !== '')
            .map((c) => (
              <Poster
                key={c.id}
                id={c.id}
                imageUrl={c.poster_path}
                title={c.title}
                rating={c.vote_average}
                year={''}
                isMovie={true}
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
