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
        <VideoFrame>
          <Iframe
            key={videos.results[0].key}
            src={`https://www.youtube.com/embed/${videos.results[0].key}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            title="Embedded youtube official trailer"
          />
        </VideoFrame>
      )}
      {(!videos.results || videos.results.length == 0) && (
        <Message color="#eee" text={'No Trailer Found'} />
      )}
    </>
  )
}

const VideoFrame = styled.div`
  width: 100%;
  max-width: 1100px;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  margin: 16px auto 0;
  border-radius: 10px;
  background: #050505;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
`

const Iframe = styled.iframe`
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
`
