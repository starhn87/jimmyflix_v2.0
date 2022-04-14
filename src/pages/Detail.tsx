import React, { Suspense, useEffect, useState } from 'react'
import Helmet from '../components/common/Helmet'
import Message from '../components/common/Message'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { moviesApi, tvApi } from '../api'
import styled from 'styled-components'
import { Grid } from '../components/common/Section'
import { customMedia } from '../GlobalStyles'
import DefaultPoster from '../assets/images/noPosterSmall.png'
import imdb from '../assets/images/imdb.png'
import Info from '../components/detail/Info'
import Tabs from '../components/detail/Tabs'
import Trailer from '../components/detail/Trailer'
import Season from '../components/detail/Season'
import Credit from '../components/detail/Credit'
import Production from '../components/detail/Production'
import Collection from '../components/detail/Collection'
import { useQuery } from 'react-query'
import { TabType } from '../interface'
import Loading from '../components/common/Loading'

function Detail() {
  const navigator = useNavigate()
  const { id } = useParams()
  const { pathname } = useLocation()
  const isMovie = pathname.includes('/movie/')
  const parsedId = Number(id)
  const [tabName, setTabName] = useState<TabType>('Trailer')
  const { data, isError } = useQuery(['detail', id], () => {
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
        Credits: (
          <Suspense fallback={<Loading />}>
            <Credit parsedId={parsedId} isMovie={isMovie} />
          </Suspense>
        ),
        Production: (
          <Production
            production_companies={data.production_companies}
            production_countries={data.production_countries}
          />
        ),
        Collection: data.belongs_to_collection && (
          <Suspense fallback={<Loading />}>
            <Collection
              id={data.belongs_to_collection.id}
              onClick={setTabName}
            />
          </Suspense>
        ),
      }
    : {}

  useEffect(() => {
    window.scrollTo(0, 0)

    if (isNaN(parsedId)) {
      navigator('/')
    }
  }, [id])

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
                    : DefaultPoster
                }
              />
              <Data>
                <Title>
                  <Text>{data.title ?? data.name}</Text>
                  <ILink
                    target="_blank"
                    href={`https://www.imdb.com/title/${data.imdb_id}`}
                  >
                    <Img src={imdb}></Img>
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

  ${customMedia.lessThan('mobile')`
        padding: 0;
    `}
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

  ${customMedia.lessThan('mobile')`
        display: none;
    `}
`

const Content = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 1;

  ${customMedia.lessThan('mobile')`
    display: block;
  `}
`

const Cover = styled.div<{ bgImage: string }>`
  width: 50%;
  height: 120%;
  background-image: url(${(props) => props.bgImage});
  background-position: center center;
  background-size: cover;
  border-radius: 5px;

  ${customMedia.lessThan('mobile')`
    width: 100%;
    height: 80%;
  `}
`

const Data = styled.div`
  overflow-y: auto;
  width: 70%;
  margin-left: 15px;

  ${customMedia.greaterThan('mobile')`
    height: 120%;
  `}

  ${customMedia.lessThan('mobile')`
    width: 100%;
    margin-left: 2.5%;
  `}
`

const Title = styled.h3`
  font-size: 32px;
  margin-bottom: 5px;

  ${customMedia.lessThan('mobile')`
    float: unset;
    padding: 3% 1%;
    width: 95%;
  `}
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

  ${customMedia.lessThan('mobile')`
    padding-bottom: 30px;
  `}
`

export const Wrapper = styled(Grid)`
  margin-top: 0;
`
