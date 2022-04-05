import React from 'react'
import Helmet from '../Components/Helmet'
import { useTV } from '../hooks/useTV'
import TVResult from '../Components/TVResult'
import Header from '../Components/Header'
import { shallowEqual } from 'react-redux'
import { TVState } from '../reducers/TVReducer'
import { useAppSelector } from '../store'
import Loading from '../Components/Loading'

export interface TVProps {
  tv: TVState
}

export function TV() {
  useTV()
  const loading = useAppSelector(
    (state: TVProps) => state.tv.loading,
    shallowEqual,
  )

  return (
    <>
      <Helmet content="TV Shows | Jimmyflix" />
      <Header />
      {loading ? <Loading /> : <TVResult />}
    </>
  )
}

export default TV
