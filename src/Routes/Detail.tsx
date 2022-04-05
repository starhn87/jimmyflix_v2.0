import React from 'react'
import Helmet from '../Components/Helmet'
import Message from '../Components/Message'
import { useDetail } from '../hooks/useDetail'
import DetailInfo from '../Components/detail'
import { shallowEqual, useSelector } from 'react-redux'
import { DetailState } from '../reducers/DetailReducer'
import Loading from '../Components/Loading'

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
      <Loading />
    </>
  ) : (
    <>
      {error ? (
        <Message color="#e74c3c" text={error}></Message>
      ) : (
        <DetailInfo />
      )}
    </>
  )
}

export default Detail
