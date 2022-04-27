import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import NotFoundImage from '../public/images/404.svg'
import Helmet from '../components/common/Helmet'
import { useRouter } from 'next/router'
import { customMedia } from '../components/common/Header'

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
      <Image src={NotFoundImage.src} alt="Not Found" />
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

  ${customMedia.lessThan('mobile')`
    height: 100%;
    padding: 20px;
  `}
`

const Image = styled.img`
  width: 90%;

  ${customMedia.greaterThan('desktop')`
    height: 803px;
  `}
`

const Message = styled.h1`
  padding: 10px;
  font-size: 20px;

  ${customMedia.lessThan('mobile')`
    font-size: 14px;
  `}
`
