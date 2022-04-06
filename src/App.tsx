import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import GlobalStyles from './Components/GlobalStyles'
import Header from './Components/Header'
import Search from './Routes/Search'
import Home from './Routes/Home'
import TV from './Routes/TV'
import Detail from './Routes/Detail'

function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/">
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
