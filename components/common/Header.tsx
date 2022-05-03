import React, { memo } from 'react'
import styled from '@emotion/styled'
import SearchBar from '../HeaderSearchBar'
import { MdOutlineMovie } from 'react-icons/md'
import { useResetRecoilState } from 'recoil'
import {
  isSearchedState,
  searchValueState,
  timeTypeState,
} from '../../recoil/store'
import { useRouter } from 'next/router'
import Link from 'next/link'

function Header() {
  const router = useRouter()
  const resetSearchValue = useResetRecoilState(searchValueState)
  const resetIsSearched = useResetRecoilState(isSearchedState)
  const resetTimeType = useResetRecoilState(timeTypeState)

  const onClick = () => {
    if (router.pathname === '/search') {
      resetIsSearched()
      resetSearchValue()
      resetTimeType()
    }
  }

  return (
    <Head className={`${router.pathname === '/404' ? 'hidden' : ''}`}>
      <LogoWrapper onClick={() => router.push('/')}>
        <MdOutlineMovie fontSize={35} />
        <Logo>Jimmyflix</Logo>
      </LogoWrapper>
      <List>
        <Item
          current={
            router.pathname === '/' || router.pathname.includes('/movies')
          }
        >
          <Link href="/">
            <Anchor>Movies</Anchor>
          </Link>
        </Item>
        <Item
          current={
            router.pathname === '/tvs' || router.pathname.includes('/tvs')
          }
        >
          <Link href="/tvs">
            <Anchor>TV</Anchor>
          </Link>
        </Item>
        <Item current={router.pathname === '/trend'}>
          <Link href="/trend">
            <Anchor>Trend</Anchor>
          </Link>
        </Item>
        <Item
          current={router.pathname.includes('/search')}
          onClick={() => onClick()}
        >
          <Link href="/search">
            <Anchor>Search</Anchor>
          </Link>
        </Item>
      </List>
      <SearchBarWrapper>
        <SearchBar />
      </SearchBarWrapper>
    </Head>
  )
}

export default memo(Header)

const Head = styled.header`
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-items: center;
  padding: 0 10px;
  background-color: rgb(20, 20, 20);
  z-index: 10;
  box-shadow: 0px 1px 5px 2px rgba(0, 0, 0, 0.8);

  &.hidden {
    display: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`

const List = styled.ul`
  display: flex;

  @media (max-width: 768px) {
    display: contents;
  }
`

const Item = styled.li<{ current: boolean }>`
  width: 100px;
  font-size: 16px;
  text-align: center;
  border-bottom: 5px solid
    ${(props) => (props.current ? '#4d96fb' : 'transparent')};
  transition: border-bottom 0.5s ease-in-out;

  @media (max-width: 768px) {
    width: 100%;
    font-size: 15px;
  }
`

const Anchor = styled.a`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }

  &:hover {
    cursor: pointer;
  }
`

const Logo = styled.div`
  margin-left: 10px;
  font-family: monospace;
  font-size: 20px;
`

const SearchBarWrapper = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`
