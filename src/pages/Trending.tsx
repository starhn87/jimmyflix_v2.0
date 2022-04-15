import React, { useEffect } from 'react'
import { trendingApi } from '../api'
import styled from 'styled-components'
import { useQueries } from 'react-query'
import Loading from '../components/common/Loading'
import HelmetWrapper from '../components/common/Helmet'
import Infos from '../components/common/Infos'
import { useAppSelector } from '../redux/store'
import TimeTypeSwitch from '../components/TimeTypeSwitch'

function Trending() {
  const timeType = useAppSelector((state) => state.data.timeType)
  const [
    { data: movies, isFetched: isMoviesFetched, isError: isMoviesError },
    { data: tvs, isFetched: isTvsFetched, isError: isTvError },
  ] = useQueries([
    {
      queryKey: ['movieTrend', timeType],
      queryFn: () => trendingApi.movie(timeType),
    },
    {
      queryKey: ['tvTrend', timeType],
      queryFn: () => trendingApi.tv(timeType),
    },
  ])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!isMoviesFetched || !isTvsFetched) {
    return <Loading />
  }

  return (
    <>
      <HelmetWrapper content="Movies | Jimmyflix" />
      <TimeTypeSwitch />
      <Container>
        <Infos
          slider={true}
          data={movies}
          title={'Movie Trend'}
          isError={isMoviesError}
        />
        <Infos
          slider={true}
          data={tvs}
          title={'TV Show Trend'}
          isError={isTvError}
        />
      </Container>
    </>
  )
}

export default Trending

export const Container = styled.div`
  padding: 20px;
`