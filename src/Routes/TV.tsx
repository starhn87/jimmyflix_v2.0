import React, { useEffect } from 'react'
import Helmet from '../Components/Helmet'
import TVResult from '../Components/TVResult'
import Header from '../Components/Header'
import { reset, success, TVState } from '../redux/reducers/TVReducer'
import { useAppDispatch } from '../redux/store'
import { tvApi } from '../api'

export interface TVProps {
  tv: TVState
}

export function TV() {
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
  }, [])

  return (
    <>
      <Helmet content="TV Shows | Jimmyflix" />
      <Header />
      <TVResult />
    </>
  )
}

export default TV
