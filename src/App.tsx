import React, { Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import GlobalStyles from './GlobalStyles'
import Search from './pages/Search'
import Home from './pages/Home'
import TV from './pages/TV'
import Detail from './pages/Detail'
import Header from './components/common/Header'
import Loading from './components/common/Loading'

function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Header />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route path="tv" element={<TV />}>
                <Route path=":id" element={<Detail />} />
              </Route>
              <Route path="search" element={<Search />} />
              <Route path="movie/:id" element={<Detail />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
