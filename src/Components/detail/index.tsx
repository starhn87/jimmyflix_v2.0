import React from 'react'
import { shallowEqual } from 'react-redux'
import styled from 'styled-components'
import imdb from '../../assets/images/imdb.png'
import defaultPosterImg from '../../assets/images/noPosterSmall.png'
import Collection from '../../Routes/Collection'
import { DetailProps } from '../../Routes/Detail'
import { customMedia } from '../GlobalStyles'
import { Grid } from '../Section'
import Helmet from '../Helmet'
import { useAppSelector } from '../../store'
import Trailer from './Trailer'
import Season from './Season'
import Production from './Production'
import Credit from './Credit'
import Tabs from './Tabs'
import Info from './Info'

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
  width: 70%;
  margin-left: 15px;

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
  overflow: auto;
  width: 100%;
  height: 785px;
  margin-top: 20px;
  margin-bottom: 30px;
`

export const Wrapper = styled(Grid)`
  margin-top: 0;
`

function Detail() {
  const { result, cast, tabName } = useAppSelector(
    (state: DetailProps) => ({ ...state.detail }),
    shallowEqual,
  )

  return (
    <>
      {result && (
        <Container>
          <Helmet content={`${result.title ?? result.name} | Jimmyflix`} />
          <Backdrop
            bgImage={`https://image.tmdb.org/t/p/original${result.backdrop_path}`}
          />
          <Content>
            <Cover
              bgImage={
                result.poster_path
                  ? `https://image.tmdb.org/t/p/original${result.poster_path}`
                  : defaultPosterImg
              }
            />
            <Data>
              <Title>
                <Text>{result.title ?? result.name}</Text>
                <ILink
                  target="_blank"
                  href={`https://www.imdb.com/title/${result.imdb_id}`}
                >
                  <Img src={imdb}></Img>
                </ILink>
              </Title>
              <Info
                vote_average={result.vote_average}
                release_date={result.release_date}
                first_air_date={result.first_air_date}
                runtime={result.runtime}
                episode_run_time={result.episode_run_time}
                genres={result.genres}
                overview={result.overview}
              />
              <Tabs
                collections={!!result.belongs_to_collection}
                seasons={!!result.seasons}
              />
              {tabName === 'Trailer' && <Trailer videos={result.videos} />}
              {tabName === 'Sequels' && result.belongs_to_collection && (
                <Collection id={result.belongs_to_collection.id} />
              )}
              {tabName === 'Season' && <Season seasons={result.seasons} />}
              {tabName === 'Credits' && <Credit cast={cast} />}
              {tabName === 'Production' && (
                <Production
                  production_companies={result.production_companies}
                  production_countries={result.production_countries}
                />
              )}
            </Data>
          </Content>
        </Container>
      )}
    </>
  )
}

export default Detail