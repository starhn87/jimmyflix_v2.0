import React from 'react'
import styled from '@emotion/styled'

interface MessageProps {
  text?: string
  color: string
}

const Message = ({ text, color }: MessageProps) => (
  <Container>
    <Text color={color}>{text}</Text>
  </Container>
)

export default Message

const Container = styled.div`
  display: flex;
  height: 10vh;
  justify-content: center;
`

const Text = styled.span<{ color: string }>`
  padding-top: 50px;
  font-size: 28px;
  color: ${(props) => props.color};

  @media (max-width: 768px) {
    font-size: 22px;
  }
`
