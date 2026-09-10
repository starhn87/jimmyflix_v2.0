import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import Helmet from '../common/Helmet'
import { Grid } from '../common/Section'
import Info from './Info'
import Tabs from './Tabs'
import Trailer from './Trailer'
import Season from './Season'
import Credit from './Credit'
import Production from './Production'
import Collection from './Collection'
import { TabType } from '../../interface'

interface DetailProps {
  detail: any
  id: number
  isMovie: boolean
}

function Detail({ detail, id, isMovie }: DetailProps) {
  const [tabName, setTabName] = useState<TabType>('Trailer')
  const title = detail.title ?? detail.name ?? 'Untitled'
  const tabContent = {
    Trailer: <Trailer videos={detail.videos ?? { results: [] }} />,
    Season: <Season seasons={detail.seasons} />,
    Credits: <Credit id={id} isMovie={isMovie} />,
    Production: (
      <Production
        production_companies={detail.production_companies}
        production_countries={detail.production_countries}
      />
    ),
    Collection: detail.belongs_to_collection ? (
      <Collection id={detail.belongs_to_collection.id} />
    ) : null,
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    setTabName('Trailer')
  }, [id])

  return (
    <Container aria-labelledby="detail-title">
      <Helmet content={`${title} | Jimmyflix`} />
      {detail.backdrop_path ? (
        <Backdrop
          bgImage={`https://image.tmdb.org/t/p/original${detail.backdrop_path}`}
          aria-hidden="true"
        />
      ) : null}
      <Content>
        <Cover
          src={
            detail.poster_path
              ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
              : '/images/defaultPoster.png'
          }
          alt={`${title} poster`}
        />
        <Heading>
          <TitleRow>
            <Title id="detail-title">{title}</Title>
            {detail.imdb_id ? (
              <IMDbLink
                target="_blank"
                rel="noreferrer"
                href={`https://www.imdb.com/title/${detail.imdb_id}`}
                aria-label={`View ${title} on IMDb (opens in a new tab)`}
              >
                <IMDbImage src="/images/imdb.png" alt="" />
              </IMDbLink>
            ) : null}
          </TitleRow>
          <Info
            vote_average={detail.vote_average}
            release_date={detail.release_date}
            first_air_date={detail.first_air_date}
            runtime={detail.runtime}
            episode_run_time={detail.episode_run_time}
            genres={detail.genres}
          />
        </Heading>
        <Overview>
          {detail.overview || 'No overview is available for this title.'}
        </Overview>
        <TabsArea>
          <Tabs
            selected={tabName}
            collections={Boolean(detail.belongs_to_collection)}
            seasons={detail.seasons?.length > 0}
            onClick={setTabName}
          />
        </TabsArea>
        <Panel>{tabContent[tabName]}</Panel>
      </Content>
    </Container>
  )
}

export default Detail

const Container = styled.main`
  position: relative;
  min-height: calc(100vh - 50px);
  overflow: hidden;
  padding: clamp(28px, 4vw, 56px);
  background: #141414;

  @media (max-width: 768px) {
    padding: 24px 16px 48px;
  }
`

const Backdrop = styled.div<{ bgImage: string }>`
  position: absolute;
  inset: 0 0 auto;
  height: min(72vh, 760px);
  background-image: linear-gradient(
      to bottom,
      rgba(20, 20, 20, 0.28),
      rgba(20, 20, 20, 0.78) 70%,
      #141414 100%
    ),
    url(${(props) => props.bgImage});
  background-position: center 22%;
  background-size: cover;
  filter: blur(3px);
  opacity: 0.58;
  pointer-events: none;
  transform: scale(1.015);

  @media (max-width: 768px) {
    display: none;
  }
`

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  width: min(1240px, 100%);
  margin: 0 auto;
  grid-template-columns: minmax(240px, 0.78fr) minmax(0, 1.45fr);
  grid-template-areas:
    'poster heading'
    'poster overview'
    'poster tabs'
    'poster panel';
  column-gap: clamp(28px, 4vw, 52px);
  row-gap: 22px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: minmax(96px, 120px) minmax(0, 1fr);
    grid-template-areas:
      'poster heading'
      'overview overview'
      'tabs tabs'
      'panel panel';
    column-gap: 16px;
    row-gap: 22px;
  }
`

const Cover = styled.img`
  grid-area: poster;
  display: block;
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 10px;
  object-fit: cover;
  background: #242424;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.38);

  @media (min-width: 769px) {
    max-height: 72vh;
  }
`

const Heading = styled.header`
  grid-area: heading;
  min-width: 0;
  padding-top: 4px;
`

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;

  @media (max-width: 768px) {
    display: block;
  }
`

const Title = styled.h1`
  min-width: 0;
  font-size: clamp(30px, 4vw, 52px);
  font-weight: 700;
  line-height: 1.12;
  overflow-wrap: anywhere;
  text-wrap: balance;

  @media (max-width: 768px) {
    font-size: clamp(22px, 6.4vw, 30px);
    line-height: 1.18;
  }
`

const IMDbLink = styled.a`
  display: inline-flex;
  flex: none;
  min-width: 44px;
  min-height: 44px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;

  &:focus-visible {
    outline: 3px solid rgba(77, 150, 251, 0.75);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    margin-top: 8px;
  }
`

const IMDbImage = styled.img`
  display: block;
  width: 38px;
  height: auto;
`

const Overview = styled.p`
  grid-area: overview;
  max-width: 76ch;
  color: rgba(255, 255, 255, 0.88);
  font-size: 15px;
  line-height: 1.75;
`

const TabsArea = styled.div`
  grid-area: tabs;
  min-width: 0;
`

const Panel = styled.div`
  grid-area: panel;
  min-width: 0;
  padding-bottom: 40px;
`

export const Product = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 220px;
  overflow: hidden;
  margin-bottom: 8px;
  border-radius: 8px;
  background-color: #f7f7f7;
`

export const Logo = styled.img<{ logo?: string }>`
  display: block;
  width: 100%;
  height: 100%;
  max-height: 220px;
  margin: 0 auto;
  padding: ${(props) => (props.logo ? '5px' : 0)};
  object-fit: ${(props) => (props.logo ? 'contain' : 'cover')};
  object-position: center;
`

export const Flag = styled.img`
  display: block;
  width: min(150px, 100%);
  height: auto;
  aspect-ratio: 5 / 3;
  margin-bottom: 8px;
  margin-inline: auto;
  object-fit: cover;
`

export const Name = styled.p`
  margin: 0 auto 10px;
  font-size: 14px;
  line-height: 1.4;
  overflow-wrap: anywhere;
  text-align: center;
`

export const CenteredItem = styled.div`
  width: 100%;
  max-width: 180px;
  min-width: 0;
  margin-inline: auto;
  text-align: center;
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
  grid-template-columns: repeat(auto-fit, minmax(140px, 180px));
  justify-content: center;
  justify-items: center;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(0, 150px));
    justify-content: center;
  }
`
