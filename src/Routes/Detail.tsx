import React from 'react'
import Helmet from '../Components/Helmet'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import { useDetail } from '../hooks/useDetail'
import Info from '../Components/Info'
import Header from '../Components/Header'
import { shallowEqual, useSelector } from 'react-redux'
import { DetailState } from '../reducers/DetailReducer'

export interface DetailProps {
  detail: DetailState
}

function Detail() {
  useDetail()
  const { loading, error } = useSelector(
    (state: DetailProps) => ({ ...state.detail }),
    shallowEqual,
  )

  return loading ? (
    <>
      <Helmet content="Loading | Jimmyflix" />
      <Loader />
    </>
  ) : (
    <>{error ? <Message color="#e74c3c" text={error}></Message> : <Info />}</>
  )
}

export default Detail
