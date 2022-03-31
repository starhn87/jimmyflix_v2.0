import React, { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { customMedia } from './GlobalStyles'

const Head = styled.header`
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  background-color: rgb(20, 20, 20);
  z-index: 10;
  box-shadow: 0px 1px 5px 2px rgba(0, 0, 0, 0.8);
`

const List = styled.ul`
  display: contents;
`

const Item = styled.li<{ current: boolean }>`
  width: 70px;
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
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`

function Header() {
  const { pathname } = useLocation()
<<<<<<< HEAD
  console.log(pathname)

=======
  
>>>>>>> bcddabf3782d8b0a1f83373876eb2402b19c99f2
  return useMemo(
    () => (
      <Head>
        <List>
          <Item current={pathname === '/' || pathname.includes('/movie')}>
            <SLink to="/">Movies</SLink>
          </Item>
          <Item current={pathname === '/tv' || pathname.includes('/tv')}>
            <SLink to="/tv">TV</SLink>
          </Item>
          <Item current={pathname.includes('/search')}>
            <SLink to="/search">Search</SLink>
          </Item>
        </List>
      </Head>
    ),
    [pathname],
  )
}

export default Header
