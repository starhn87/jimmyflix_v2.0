import React from 'react'
import Loader from '../Components/Loader'
import Helmet from '../Components/Helmet'
import { useHome } from '../hooks/useHome'
import MovieResult from '../Components/MovieResult'
import Header from '../Components/Header'
import { shallowEqual } from 'react-redux'
import { HomeState } from '../reducers/HomeReducer'
import { useAppSelector } from '../store'

interface Props {
  home: HomeState
}

function Home() {
  useHome()
  const loading = useAppSelector(
    (state: Props) => state.home.loading,
    shallowEqual,
  )

  return (
    <>
      <Helmet content="Movies | Jimmyflix" />
      <Header />
      {loading ? <Loader /> : <MovieResult />}
    </>
  )
}

export default Home
