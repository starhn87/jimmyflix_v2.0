import { useEffect } from 'react'
import { shallowEqual } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { moviesApi, tvApi } from '../api'
import { fail, success, reset, cast } from '../reducers/DetailReducer'
import { DetailProps } from '../Routes/Detail'
import { useAppDispatch, useAppSelector } from '../store'

export function useDetail(): void {
  const navigator = useNavigate()
  const { id } = useParams()
  const { pathname } = useLocation()
  const dispatch = useAppDispatch()
  const isMovie = pathname.includes('/movie/')
  const tabName = useAppSelector(
    (state: DetailProps) => state.detail.tabName,
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
}
