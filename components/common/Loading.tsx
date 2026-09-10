import React from 'react'
import styled from '@emotion/styled'

interface LoadingProps {
  label?: string
  fullPage?: boolean
}

const Loading = ({
  label = 'Loading content…',
  fullPage = true,
}: LoadingProps) => (
  <Container role="status" aria-live="polite" fullPage={fullPage}>
    <Spinner aria-hidden="true" />
    <Label>{label}</Label>
  </Container>
)

export default Loading

const Container = styled.div<{ fullPage: boolean }>`
  position: ${(props) => (props.fullPage ? 'fixed' : 'relative')};
  min-height: ${(props) => (props.fullPage ? 'calc(100vh - 50px)' : '180px')};
  inset: ${(props) => (props.fullPage ? '50px 0 0' : 'auto')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
  letter-spacing: 0.04em;
  z-index: ${(props) => (props.fullPage ? 9 : 'auto')};
`

const Spinner = styled.span`
  width: 42px;
  height: 42px;
  border: 4px solid rgba(77, 150, 251, 0.25);
  border-top-color: #4d96fb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    border-color: rgba(77, 150, 251, 0.55);
  }
`

const Label = styled.span`
  line-height: 1.4;
`
