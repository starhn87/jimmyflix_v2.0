import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import GlobalStyles from './GlobalStyles'
import Header from './components/common/Header'
import Search from './routes/Search'
import Home from './routes/Home'
import TV from './routes/TV'
import Detail from './routes/Detail'

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
