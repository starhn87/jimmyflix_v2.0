import React from 'react'
import Link from 'next/link'
import styled from '@emotion/styled'

interface RequestErrorProps {
  title: string
  message?: string
  onRetry?: () => void
  isRetrying?: boolean
  backHref?: string
  backLabel?: string
  compact?: boolean
}

export default function RequestError({
  title,
  message = 'Check your connection and try again.',
  onRetry,
  isRetrying = false,
  backHref,
  backLabel = 'Back to browse',
  compact = false,
}: RequestErrorProps) {
  return (
    <Container role="alert" compact={compact} aria-busy={isRetrying}>
      <Title>{title}</Title>
      <Description>{message}</Description>
      {(onRetry || backHref) && (
        <Actions>
          {onRetry && (
            <RetryButton type="button" onClick={onRetry} disabled={isRetrying}>
              {isRetrying ? 'Retrying…' : 'Try again'}
            </RetryButton>
          )}
          {backHref && (
            <Link href={backHref} passHref>
              <BackLink>{backLabel}</BackLink>
            </Link>
          )}
        </Actions>
      )}
    </Container>
  )
}

const Container = styled.section<{ compact: boolean }>`
  display: flex;
  width: 100%;
  max-width: ${(props) => (props.compact ? 'none' : '760px')};
  min-height: ${(props) => (props.compact ? '120px' : '220px')};
  margin: ${(props) =>
    props.compact ? '16px 0 36px' : 'clamp(60px, 15vh, 140px) auto 48px'};
  padding: ${(props) => (props.compact ? '24px' : 'clamp(28px, 5vw, 48px)')};
  border: 1px solid rgba(255, 156, 145, 0.35);
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  background: rgba(255, 156, 145, 0.06);
  text-align: center;
`

const Title = styled.h2`
  font-size: clamp(18px, 3vw, 24px);
  font-weight: 600;
`

const Description = styled.p`
  max-width: 520px;
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 15px;
  line-height: 1.5;
`

const Actions = styled.div`
  display: flex;
  margin-top: 22px;
  gap: 12px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`

const RetryButton = styled.button`
  display: inline-flex;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid #4d96fb;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #347fdc;
  font-size: 14px;
  font-weight: 600;

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }

  &:focus-visible {
    outline: 3px solid rgba(77, 150, 251, 0.45);
    outline-offset: 3px;
  }
`

const BackLink = styled.a`
  display: inline-flex;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid #4d96fb;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  color: #8ebeff;
  background: transparent;
  font-size: 14px;
  font-weight: 600;

  &:focus-visible {
    outline: 3px solid rgba(77, 150, 251, 0.45);
    outline-offset: 3px;
  }
`
