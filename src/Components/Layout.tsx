import React from 'react'
import styled from 'styled-components'
import Header from './Header'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

const Wrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 110px);
  padding-top: 7rem;
`
