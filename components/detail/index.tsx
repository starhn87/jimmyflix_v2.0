import React, { Suspense, useEffect, useState } from 'react'
import Helmet from '../../components/common/Helmet'
import Message from '../../components/common/Message'
import { useRouter } from 'next/router'
import { moviesApi, tvApi } from '../../pages/api'
import styled from '@emotion/styled'
import { Grid } from '../../components/common/Section'
import DefaultPoster from '../../public/images/defaultPoster.png'
import imdb from '../../public/images/imdb.png'
import Info from '../../components/detail/Info'
import Tabs from '../../components/detail/Tabs'
import Trailer from '../../components/detail/Trailer'
import Season from '../../components/detail/Season'
import Credit from '../../components/detail/Credit'
import Production from '../../components/detail/Production'
import Collection from '../../components/detail/Collection'
import { useQuery } from 'react-query'
import { TabType } from '../../interface'
import Loading from '../../components/common/Loading'

function Detail() {
  const router = useRouter()
  const isMovie = router.pathname.includes('/movies/')
  const { id } = router.query
  const parsedId = Number(id)
  const [tabName, setTabName] = useState<TabType>('Trailer')
  const { data, isError, isFetched } = useQuery(['detail', id], () => {
    if (isMovie) {
      return moviesApi.movieDetail(parsedId)
    } else {
      return tvApi.showDetail(parsedId)
    }
  })
  const tabContent = data
    ? {
        Trailer: <Trailer videos={data.videos} />,
        Season: <Season seasons={data.seasons} />,
        Credits: <Credit parsedId={parsedId} isMovie={isMovie} />,
        Production: (
          <Production
            production_companies={data.production_companies}
            production_countries={data.production_countries}
          />
        ),
        Collection: data.belongs_to_collection && (
          <Collection id={data.belongs_to_collection.id} />
        ),
      }
    : {}

  useEffect(() => {
    window.scrollTo(0, 0)
    setTabName('Trailer')

    if (isNaN(parsedId)) {
      router.push('/')
    }
  }, [id])

  if (!isFetched) {
    return <Loading />
  }

  return (
    <>
      {isError ? (
        <>
          <Helmet content="Error | Jimmyflix" />
          <Message color="#e74c3c" text={'Error in detail'}></Message>
        </>
      ) : (
        <>
          <Container>
            <Helmet content={`${data.title ?? data.name} | Jimmyflix`} />
            <Backdrop
              bgImage={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
            />
            <Content>
              <Cover
                bgImage={
                  data.poster_path
                    ? `https://image.tmdb.org/t/p/original${data.poster_path}`
                    : DefaultPoster.src
                }
              />
              <Data>
                <Title>
                  <Text>{data.title ?? data.name}</Text>
                  <ILink
                    target="_blank"
                    href={`https://www.imdb.com/title/${data.imdb_id}`}
                  >
                    <Img src={imdb.src}></Img>
                  </ILink>
                </Title>
                <Info
                  vote_average={data.vote_average}
                  release_date={data.release_date}
                  first_air_date={data.first_air_date}
                  runtime={data.runtime}
                  episode_run_time={data.episode_run_time}
                  genres={data.genres}
                  overview={data.overview}
                />
                <Tabs
                  selected={tabName}
                  collections={!!data.belongs_to_collection}
                  seasons={!!data.seasons}
                  onClick={setTabName}
                />
                {tabContent[tabName]}
              </Data>
            </Content>
          </Container>
        </>
      )}
    </>
  )
}

export default Detail

const Container = styled.div`
  position: relative;
  padding: 50px;
  width: 100%;
  height: calc(100vh - 50px);
  overflow-x: hidden;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 0;
  }
`

const Backdrop = styled.div<{ bgImage: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%;
  background-image: url(${(props) => props.bgImage});
  background-position: center center;
  background-size: cover;
  filter: blur(3px);
  opacity: 0.5;
  z-index: 0;

  @media (max-width: 768px) {
    display: none;
  }
`

const Content = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 1;

  @media (max-width: 768px) {
    display: block;
  }
`

const Cover = styled.div<{ bgImage: string }>`
  width: 50%;
  height: 120%;
  background-image: url(${(props) => props.bgImage});
  background-position: center center;
  background-size: cover;
  border-radius: 5px;

  @media (max-width: 768px) {
    width: 100%;
    height: 80%;
  }
`

const Data = styled.div`
  overflow-y: auto;
  width: 70%;
  margin-left: 15px;

  @media (min-width: 768px) {
    height: 120%;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 2.5%;
  }
`

const Title = styled.h3`
  font-size: 32px;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    float: unset;
    padding: 3% 1%;
    width: 95%;
  }
`

const Text = styled.span`
  margin-right: 20px;
`

const ILink = styled.a`
  width: 100px;
  height: 10px;
  vertical-align: super;

  &:hover {
    text-decoration: underline;
  }
`

const Img = styled.img`
  width: 33px;
  height: 17px;
  vertical-align: -4px;
`

export const Product = styled.div`
  display: flex;
  align-items: center;
  height: 220px;
  margin-bottom: 8px;
  background-color: #f7f7f7;
`

export const Logo = styled.img<{ logo?: string }>`
  width: 100%;
  max-height: 220px;
  padding: ${(props) => (props.logo ? '5px' : 0)};
`

export const Flag = styled.img`
  width: 150px;
  height: 90px;
  margin-bottom: 8px;
`

export const Name = styled.p`
  margin-bottom: 10px;
  justify-content: center;
  font-size: 14px;
`

export const Box = styled.div`
  width: 100%;
  margin-top: 20px;

  @media (max-width: 768px) {
    padding-bottom: 30px;
  }
`

export const Wrapper = styled(Grid)`
  margin-top: 0;
`
