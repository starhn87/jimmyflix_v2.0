import React from 'react'
import Helmet from '../Components/Helmet'
import { useHome } from '../hooks/useHome'
import MovieResult from '../Components/MovieResult'
import { shallowEqual } from 'react-redux'
import { HomeState } from '../reducers/HomeReducer'
import { useAppSelector } from '../store'
import Loading from '../Components/Loading'

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
      {loading ? <Loading /> : <MovieResult />}
    </>
  )
}

export default Home
