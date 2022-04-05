import React, { useEffect } from 'react'
import Helmet from '../Components/Helmet'
import TVResult from '../Components/TVResult'
import Header from '../Components/Header'
import { shallowEqual } from 'react-redux'
import { reset, success, TVState } from '../redux/TVReducer'
import { useAppDispatch, useAppSelector } from '../redux/store'
import Loading from '../Components/Loading'
import { tvApi } from '../api'

export interface TVProps {
  tv: TVState
}

export function TV() {
  const loading = useAppSelector(
    (state: TVProps) => state.tv.loading,
    shallowEqual,
  )
  const dispatch = useAppDispatch()

  const getTV = async () => {
    try {
      const {
        data: { results: topRated },
      } = await tvApi.topRated()
      const {
        data: { results: popular },
      } = await tvApi.popular()
      const {
        data: { results: airingToday },
      } = await tvApi.airingToday()
      dispatch(success({ topRated, popular, airingToday }))
    } catch {
      dispatch(fail())
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    getTV()

    return () => {
      dispatch(reset())
    }
  }, [])

  return (
    <>
      <Helmet content="TV Shows | Jimmyflix" />
      <Header />
      {loading ? <Loading /> : <TVResult />}
    </>
  )
}

export default TV
