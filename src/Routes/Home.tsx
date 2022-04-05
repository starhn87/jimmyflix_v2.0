import React, { useEffect } from 'react'
import Helmet from '../Components/Helmet'
import MovieResult from '../Components/MovieResult'
import { useDispatch } from 'react-redux'
import { reset, success } from '../redux/reducers/HomeReducer'
import { moviesApi } from '../api'

function Home() {
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
  }, [])

  return (
    <>
      <Helmet content="Movies | Jimmyflix" />
      <MovieResult />
    </>
  )
}

export default Home
