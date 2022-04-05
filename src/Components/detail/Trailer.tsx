import React from 'react'
import styled from 'styled-components'
import { customMedia } from '../GlobalStyles'
import Message from '../Message'

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
  &:first-child {
    margin-top: 5px;
  }
  &:last-child {
    margin-bottom: 30px;
  }

  ${customMedia.lessThan('mobile')`
        width: 95%;
        padding: 5px 0;
        height: 400px;
    `}
`
