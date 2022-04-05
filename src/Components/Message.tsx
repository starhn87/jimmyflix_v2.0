import React from 'react'
import styled from 'styled-components'
import { customMedia } from './GlobalStyles'

interface Props {
  text?: string
  color: string
}

const Message: React.FunctionComponent<Props> = ({ text, color }) => (
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

  ${customMedia.lessThan('mobile')`
        font-size: 22px;
    `}
`
