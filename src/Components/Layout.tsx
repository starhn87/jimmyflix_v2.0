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
