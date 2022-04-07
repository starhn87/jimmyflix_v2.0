import React, { memo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { customMedia } from '../../GlobalStyles'
import SearchBar from '../HeaderSearchBar'
import { MdOutlineMovie } from 'react-icons/md'
import { useAppDispatch } from '../../redux/store'
import { reset } from '../../redux/SearchReducer'

function Header() {
  const { pathname } = useLocation()
  const dispatch = useAppDispatch()
  const navigator = useNavigate()

  const onClick = () => {
    if (pathname === '/search') {
      dispatch(reset())
    }
  }

  return (
    <Head>
      <LogoWrapper onClick={() => navigator('/')}>
        <MdOutlineMovie fontSize={35} />
        <Logo>Jimmyflix</Logo>
      </LogoWrapper>
      <List>
        <Item current={pathname === '/' || pathname.includes('/movie')}>
          <SLink to="/">Movies</SLink>
        </Item>
        <Item current={pathname === '/tv' || pathname.includes('/tv')}>
          <SLink to="/tv">TV</SLink>
        </Item>
        <Item current={pathname.includes('/search')} onClick={() => onClick()}>
          <SLink to="/search">Search</SLink>
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
`

const List = styled.ul`
  display: flex;

  ${customMedia.lessThan('mobile')`
    display: contents;
	`}
`

const Item = styled.li<{ current: boolean }>`
  width: 100px;
  font-size: 16px;
  text-align: center;
  border-bottom: 5px solid
    ${(props) => (props.current ? '#4d96fb' : 'transparent')};
  transition: border-bottom 0.5s ease-in-out;

  ${customMedia.lessThan('mobile')`
		width: 100%;
		font-size: 15px;
	`}
`

const SLink = styled(Link)`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;

  ${customMedia.lessThan('mobile')`
    display: none;
	`}

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
  ${customMedia.lessThan('mobile')`
    display: none;
	`}
`
