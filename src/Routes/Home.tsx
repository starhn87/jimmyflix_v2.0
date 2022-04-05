import React, { Suspense, useEffect } from 'react'
import Helmet from '../Components/Helmet'
import MovieResult from '../Components/MovieResult'
import { shallowEqual, useDispatch } from 'react-redux'
import { HomeState, reset, success } from '../redux/HomeReducer'
import { useAppSelector } from '../redux/store'
import Loading from '../Components/Loading'
import { moviesApi } from '../api'

interface Props {
  home: HomeState
}

function Home() {
  const loading = useAppSelector(
    (state: Props) => state.home.loading,
    shallowEqual,
  )
  const dispatch = useDispatch()

  const getHome = async () => {
    try {
      const {
        data: { results: nowPlaying },
      } = await moviesApi.nowPlaying()
      const {
        data: { results: upcoming },
      } = await moviesApi.upcoming()
      const {
        data: { results: popular },
      } = await moviesApi.popular()
      dispatch(success({ nowPlaying, upcoming, popular }))
    } catch {
      dispatch(fail())
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    getHome()

    return () => {
      dispatch(reset())
    }
  }, [])

  return (
    <>
      <Helmet content="Movies | Jimmyflix" />
      {loading ? <Loading /> : <MovieResult />}
    </>
  )
}

export default Home
