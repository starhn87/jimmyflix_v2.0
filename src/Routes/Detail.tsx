import React, { useEffect } from 'react'
import Helmet from '../Components/Helmet'
import Message from '../Components/Message'
import DetailInfo from '../Components/detail'
import { shallowEqual, useSelector } from 'react-redux'
import {
  cast,
  DetailState,
  reset,
  success,
} from '../redux/reducers/DetailReducer'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { moviesApi, tvApi } from '../api'

export interface DetailProps {
  detail: DetailState
}

function Detail() {
  const navigator = useNavigate()
  const { id } = useParams()
  const { pathname } = useLocation()
  const dispatch = useAppDispatch()
  const isMovie = pathname.includes('/movie/')
  const tabName = useAppSelector(
    (state: DetailProps) => state.detail.tabName,
    shallowEqual,
  )
  const { error } = useSelector(
    (state: DetailProps) => ({ ...state.detail }),
    shallowEqual,
  )
  const parsedId = Number(id)

  const getDetail = async () => {
    if (isNaN(parsedId)) {
      navigator('/')
    }

    let results
    try {
      if (isMovie) {
        ;({ data: results } = await moviesApi.movieDetail(parsedId))
      } else {
        ;({ data: results } = await tvApi.showDetail(parsedId))
      }
      dispatch(success({ results }))
    } catch {
      dispatch(fail())
    }
  }

  const getCast = async () => {
    if (isNaN(parsedId)) {
      navigator('/')
    }

    let casts
    try {
      if (isMovie) {
        ;({
          data: { cast: casts },
        } = await moviesApi.cast(parsedId))
      } else {
        ;({
          data: { cast: casts },
        } = await tvApi.cast(parsedId))
      }
      dispatch(cast({ casts }))
    } catch {
      dispatch(fail())
    }
  }

  useEffect(() => {
    if (tabName === 'Credits') {
      getCast()
    }
  }, [tabName])

  useEffect(() => {
    window.scrollTo(0, 0)
    getDetail()

    return () => {
      dispatch(reset())
    }
  }, [id])

  return (
    <>
      {error ? (
        <>
          <Helmet content="Error | Jimmyflix" />
          <Message color="#e74c3c" text={error}></Message>
        </>
      ) : (
        <DetailInfo />
      )}
    </>
  )
}

export default Detail
