import React from 'react'
import styled from '@emotion/styled'
import Message from '../common/Message'

interface TrailerProps {
  videos: {
    results: {
      key: string
    }[]
  }
}

export default function Trailer({ videos }: TrailerProps) {
  return (
    <>
      {videos.results && videos.results.length > 0 && (
        <Iframe
          key={videos.results[0].key}
          src={`https://www.youtube.com/embed/${videos.results[0].key}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube official trailer"
        />
      )}
      {(!videos.results || videos.results.length == 0) && (
        <Message color="#eee" text={'No Trailer Found'} />
      )}
    </>
  )
}

const Iframe = styled.iframe`
  margin-top: 15px;
  width: 100%;
  height: 80%;

  @media (max-width: 768px) {
    width: 95%;
    height: 400px;
    margin-bottom: 30px;
    padding: 5px 0;
  }
`
