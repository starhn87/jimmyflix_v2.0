import React from 'react'
import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Helmet from '../components/common/Helmet'

export default function NotFound() {
  const router = useRouter()

  const goBack = () => {
    const hasInternalReferrer =
      document.referrer &&
      new URL(document.referrer).origin === window.location.origin

    if (hasInternalReferrer) {
      router.back()
      return
    }

    void router.push('/')
  }

  return (
    <Wrapper>
      <Helmet content="Page not found | Jimmyflix" />
      <Image src="/images/404.svg" alt="" aria-hidden="true" />
      <Title>Page not found</Title>
      <Description>
        The page may have moved or the address may be incorrect.
      </Description>
      <Actions>
        <Link href="/" passHref>
          <HomeLink>Go to movies</HomeLink>
        </Link>
        <BackButton type="button" onClick={goBack}>
          Previous page
        </BackButton>
      </Actions>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  display: flex;
  width: 100%;
  min-height: calc(100vh - 50px);
  padding: 32px 20px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
`

const Image = styled.img`
  width: min(90%, 760px);
  max-height: 55vh;
`

const Title = styled.h1`
  margin-top: 20px;
  font-size: clamp(24px, 5vw, 38px);
  font-weight: 600;
`

const Description = styled.p`
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 15px;
  line-height: 1.5;
`

const Actions = styled.div`
  display: flex;
  margin-top: 24px;
  gap: 12px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`

const HomeLink = styled.a`
  display: inline-flex;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid #4d96fb;
  border-radius: 6px;
  align-items: center;
  color: #fff;
  background: #347fdc;
  font-size: 14px;
  font-weight: 600;

  &:focus-visible {
    outline: 3px solid rgba(77, 150, 251, 0.45);
    outline-offset: 3px;
  }
`

const BackButton = styled.button`
  display: inline-flex;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid #4d96fb;
  border-radius: 6px;
  align-items: center;
  color: #8ebeff;
  background: transparent;
  font-size: 14px;
  font-weight: 600;

  &:focus-visible {
    outline: 3px solid rgba(77, 150, 251, 0.45);
    outline-offset: 3px;
  }
`
