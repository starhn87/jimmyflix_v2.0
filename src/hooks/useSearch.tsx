import { useEffect } from 'react'
import { moviesApi, tvApi } from '../api'
import { fail, success, loading, term } from '../reducers/SearchReducer'
import { SearchProps } from '../Routes/Search'
import { useAppDispatch, useAppSelector } from '../store'

interface Props {
  handleSubmit: (value: string) => void
}

export function useSearch(): Props {
  const dispatch = useAppDispatch()

  const handleSubmit = (value: string) => {
    if (value.trim() !== '') {
      dispatch(loading())
      searchByTerm(value)
    } else {
      alert('Input what you wannt to know!')
    }
  }

  const searchByTerm = async (value: string) => {
    try {
      const {
        data: { results: movieResults },
      } = await moviesApi.search(value)
      const {
        data: { results: tvResults },
      } = await tvApi.search(value)
      dispatch(success({ movieResults, tvResults }))
    } catch {
      dispatch(fail())
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return { handleSubmit }
}
