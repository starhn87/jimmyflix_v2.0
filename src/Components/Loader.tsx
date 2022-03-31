import React from 'react'
import styled from 'styled-components'
import spinner from '../assets/images/Spinner.gif'

const Container = styled.div`
  display: flex;
  margin-top: 20px;
  width: 100vw;
  height: 100vh;
  font-size: 28px;
  justify-content: center;
`

const Spinner = styled.img`
  width: 50px;
  height: 50px;
`

function Loader() {
  return (
    <Container>
      <Spinner src={spinner} />
    </Container>
  )
}

export default Loader
