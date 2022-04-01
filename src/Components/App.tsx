import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from '../Routes/Home'
import TV from '../Routes/TV'
import Search from '../Routes/Search'
import Detail from '../Routes/Detail'
import Layout from './Layout'
import GlobalStyles from './GlobalStyles'

function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tv" element={<TV />} />
            <Route path="search" element={<Search />} />
            <Route path="movie/:id" element={<Detail />} />
            <Route path="tv/:id" element={<Detail />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
