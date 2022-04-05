import React, { ComponentType, lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import GlobalStyles from './Components/GlobalStyles'
import Loading from './Components/Loading'
import Header from './Components/Header'
import { lazyMinLoadTime } from './util'
import Search from './Routes/Search'

function App() {
  const Home = lazyMinLoadTime(() => import('./Routes/Home'), 1000)
  const TV = lazyMinLoadTime(() => import('./Routes/TV'), 1000)
  const Detail = lazyMinLoadTime(() => import('./Routes/Detail'), 1000)

  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Header />
        <Suspense fallback={<Loading />}>
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
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
