import React from 'react'
import styled from '@emotion/styled'
import { IContent } from '../../interface'
import Poster from './Poster'
import RequestError from './RequestError'
import Section from './Section'

const SKELETON_ITEMS = [0, 1, 2, 3, 4, 5]

interface InfosProps {
  slider: boolean
  data?: IContent[]
  isError: boolean
  isLoading?: boolean
  isFetching?: boolean
  onRetry?: () => void
  title?: string
}

export default function Infos({
  slider,
  data = [],
  title,
  isError,
  isLoading = false,
  isFetching = false,
  onRetry,
}: InfosProps) {
  const hasData = data.length > 0

  if (isLoading && !hasData) {
    return (
      <StateSection aria-label={title} aria-busy="true">
        {title && <StateTitle>{title}</StateTitle>}
        <ScreenReaderStatus role="status" aria-live="polite">
          Loading {title ?? 'content'}…
        </ScreenReaderStatus>
        <SkeletonList aria-hidden="true">
          {SKELETON_ITEMS.map((item) => (
            <SkeletonCard key={item} />
          ))}
        </SkeletonList>
      </StateSection>
    )
  }

  if (isError && !hasData) {
    return (
      <RequestError
        compact
        title={`Couldn't load ${title ?? 'this section'}`}
        onRetry={onRetry}
        isRetrying={isFetching}
      />
    )
  }

  return (
    <>
      {hasData && (
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
              isMovie={Boolean(content.title)}
            />
          ))}
        </Section>
      )}
      {isFetching && hasData && !isError && (
        <UpdateStatus role="status" aria-live="polite">
          Updating {title ?? 'content'}…
        </UpdateStatus>
      )}
      {isError && hasData && (
        <RequestError
          compact
          title={`Couldn't refresh ${title ?? 'this section'}`}
          message="The existing results are still available."
          onRetry={onRetry}
          isRetrying={isFetching}
        />
      )}
    </>
  )
}

const StateSection = styled.section`
  margin: 10px 0 50px;
`

const StateTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
`

const ScreenReaderStatus = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

const SkeletonList = styled.div`
  display: grid;
  margin-top: 35px;
  overflow: hidden;
  grid-template-columns: repeat(6, minmax(120px, 1fr));
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
`

const SkeletonCard = styled.div`
  aspect-ratio: 2 / 3;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.06) 25%,
    rgba(255, 255, 255, 0.13) 50%,
    rgba(255, 255, 255, 0.06) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;

  @keyframes shimmer {
    from {
      background-position: 100% 0;
    }
    to {
      background-position: -100% 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const UpdateStatus = styled.p`
  margin: -38px 0 30px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 13px;
`
