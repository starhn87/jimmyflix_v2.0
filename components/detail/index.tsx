import React, { useEffect, useState } from 'react'
import Helmet from '../../components/common/Helmet'
import Message from '../../components/common/Message'
import { useRouter } from 'next/router'
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
import { TabType } from '../../interface'

interface DetailProps {
  detail: any
  id: number
  isMovie: boolean
}

function Detail({ detail, id, isMovie }: DetailProps) {
  const [tabName, setTabName] = useState<TabType>('Trailer')
  const tabContent = detail
    ? {
        Trailer: <Trailer videos={detail.videos} />,
        Season: <Season seasons={detail.seasons} />,
        Credits: <Credit id={id} isMovie={isMovie} />,
        Production: (
          <Production
            production_companies={detail.production_companies}
            production_countries={detail.production_countries}
          />
        ),
        Collection: detail.belongs_to_collection && (
          <Collection id={detail.belongs_to_collection.id} />
        ),
      }
    : {}

  useEffect(() => {
    window.scrollTo(0, 0)
    setTabName('Trailer')
  }, [id])

  return (
    <>
      <Container>
        <Helmet content={`${detail.title ?? detail.name} | Jimmyflix`} />
        <Backdrop
          bgImage={`https://image.tmdb.org/t/p/original${detail.backdrop_path}`}
        />
        <Content>
          <Cover
            bgImage={
              detail.poster_path
                ? `https://image.tmdb.org/t/p/original${detail.poster_path}`
                : DefaultPoster.src
            }
          />
          <Data>
            <Title>
              <Text>{detail.title ?? detail.name}</Text>
              <ILink
                target="_blank"
                href={`https://www.imdb.com/title/${detail.imdb_id}`}
              >
                <Img src={imdb.src}></Img>
              </ILink>
            </Title>
            <Info
              vote_average={detail.vote_average}
              release_date={detail.release_date}
              first_air_date={detail.first_air_date}
              runtime={detail.runtime}
              episode_run_time={detail.episode_run_time}
              genres={detail.genres}
              overview={detail.overview}
            />
            <Tabs
              selected={tabName}
              collections={!!detail.belongs_to_collection}
              seasons={!!detail.seasons}
              onClick={setTabName}
            />
            {tabContent[tabName]}
          </Data>
        </Content>
      </Container>
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
