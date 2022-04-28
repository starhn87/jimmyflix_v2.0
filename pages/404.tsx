import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import Helmet from '../components/common/Helmet'
import { useRouter } from 'next/router'

export default function NotFound() {
  const [second, setSecond] = useState(5)
  const router = useRouter()

  useEffect(() => {
    if (second === 0) {
      router.push('/')
    }

    const decrease = setTimeout(() => {
      setSecond((prev) => prev - 1)
    }, 1000)

    return () => {
      clearTimeout(decrease)
    }
  })

  return (
    <Wrapper>
      <Helmet content="404 | Jimmyflix" />
      <Image src={'/images/404.svg'} alt="Not Found" />
      <Message>{second}초 후 홈 화면으로 이동합니다.</Message>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  width: 100%;
  padding: 20px;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  @media (max-width: 768px) {
    height: 100%;
    padding: 20px;
  }
`

const Image = styled.img`
  width: 90%;

  @media (min-width: 1630px) {
    height: 803px;
  }
`

const Message = styled.h1`
  padding: 10px;
  font-size: 20px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`
