import React from 'react'
import { IContent } from '../../interface'
import Message from './Message'
import Poster from './Poster'
import Section from './Section'

interface InfosProps {
  slider: boolean
  data: IContent[]
  isError: boolean
  title?: string
}

export default function Infos({ slider, data, title, isError }: InfosProps) {
  return (
    <>
      {data?.length > 0 && (
        <Section slide={slider} title={title}>
          {data.map((content) => (
            <Poster
              key={content.id}
              id={content.id}
              imageUrl={content.poster_path}
              title={content.title ?? content.name}
              rating={content.vote_average}
              year={
                content.first_air_date
                  ? content.first_air_date.substring(0, 4)
                  : content.release_date
                  ? content.release_date.substring(0, 4)
                  : ''
              }
              isMovie={content.title ? true : false}
            />
          ))}
        </Section>
      )}
      {isError && <Message color="#e74c3c" text={`Error in ${title}`} />}
    </>
  )
}
