import React from "react";
import Helmet from "react-helmet";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import imdb from "../assets/images/imdb.png";
import defaultPosterImg from "../assets/images/noPosterSmall.png";
import defaultPersonImg from "../assets/images/noPersonSmall.png";
import defaultProductionImg from "../assets/images/noProductionSmall.png";
import Collection from "../Routes/Collection";
import { DetailProps } from "../Routes/Detail";
import { customMedia } from "./GlobalStyles";
import Section from "./Section";
import { tab } from "../reducers/DetailReducer";
import Message from "./Message";

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
`;

const Backdrop = styled.div < { bgImage: string }> `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 120%;
    background-image: url(${props => props.bgImage});
    background-position: center center;
    background-size: cover;
    filter: blur(3px);
    opacity: 0.5;
    z-index: 0;

    ${customMedia.lessThan('mobile')`
        display: none;
    `}
`;

const Content = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    z-index: 1;

    ${customMedia.lessThan('mobile')`
        display: block;
        
    `}
`;

const Cover = styled.div<{ bgImage: string }>`
    width: 50%;
    height: 120%;
    background-image: url(${props => props.bgImage});
    background-position: center center;
    background-size: cover;
    border-radius: 5px;

    ${customMedia.lessThan('mobile')`
        width: 100%;
        height: 80%;
    `}
`;

const Data = styled.div`
    width: 70%;
    margin-left: 15px;

    ${customMedia.lessThan('mobile')`
        width: 100%;
        margin-left: 2.5%;
    `}
`;

const Title = styled.h3`
    font-size: 32px;
    margin-bottom: 5px;
    
    ${customMedia.lessThan('mobile')`
        float: unset;
        padding: 3% 1%;
        width: 95%;
    `}
`;

const Text = styled.span`
    margin-right: 20px;
`;

const Rating = styled.span`
    display: inline-flex;
    
    ${customMedia.lessThan('mobile')`
    `}
`;

const ItemContainer = styled.div`
    margin: 15px 0;
    line-height: 20px;

    ${customMedia.lessThan('mobile')`
        width: 95%;
        margin: 0;
        padding: 0 1% 3%;
    `}
`;

const Item = styled.span``;

const Divider = styled.span`
    margin: 0 10px;
`;

const Overview = styled.p`
    line-height: 1.5;
    font-size: 12px;
    opacity: 0.7;
    
    ${customMedia.lessThan('mobile')`
        width: 95%;
    `}
`;

const ILink = styled.a`
    width: 100px;
    height: 10px;
    vertical-align: super;
    &:hover {
        text-decoration: underline;
    }
`;

const Img = styled.img`
    width: 33px;
    height: 17px;
    vertical-align: -4px;
`;

const Tab = styled.div`
    margin-top: 20px;
    color: white;
    height: 50px;
    display: flex;
    align-items: center;
    vertical-align: center;
    padding: 0 10px;
    background-color: rgba(20, 20, 20, 0.8);
    z-index: 10;
    box-shadow: 0px 1px 5px 2px rgba(0, 0, 0, 0.8);

    ${customMedia.lessThan('mobile')`
        width: 95%;
        padding: 1%;
    `}
`;

const List = styled.ul`
    display: contents;
    width: 100%;
`;

const Li = styled.li`
	width: 100%;
	text-align: center;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    &.active {
        border-bottom: 3px solid #b1ddf9;
        transition: border-bottom .2s;
    }
`;

const Iframe = styled.iframe`
    margin-top: 7px;
    width: 100%;
    height: 80%;
    &: first-child {
        margin-top: 5px;
    }
    &: last-child {
        margin-bottom: 30px;
    }

    ${customMedia.lessThan('mobile')`
        width: 95%;
        padding: 5px 0;
        height: 400px;
    `}
`;

const Product = styled.div`
    display: flex;
    align-items: center;
    height: 220px;
    margin-bottom: 8px;
    background-color: #F7F7F7;
`;

const Logo = styled.img<{ logo?: string }>`
    width: 100%;
    padding: ${props => props.logo ? '5px' : 0};
`;

const Flag = styled.img`
    width: 150px;
    height: 90px;
    margin-bottom: 8px;
`;

const Name = styled.p`
    margin-bottom: 10px;
    justify-content: center;
    font-size: 14px;
`;

const Box = styled.div`
    width: 100%;
    margin-top: 20px;
    margin-bottom: 30px;
`;

function Info() {
    const { result, cast, tabName } = useSelector((state: DetailProps) => ({ ...state.detail }), shallowEqual);
    const dispatch = useDispatch();

    const onEvent: any = (event: any) => {
        (document.querySelector(".active") as HTMLLIElement).classList.remove('active');

        const clickedLi = event.target;
        dispatch(tab(clickedLi.innerText));
        clickedLi.classList.add('active');
    }

    return (
        <>
            {result &&
                <Container>
                    <Helmet>
                        <title>{result.title ? result.title : result.name} | Jimmyflix</title>
                    </Helmet>
                    <Backdrop bgImage={`https://image.tmdb.org/t/p/original${result.backdrop_path}`} />
                    <Content>
                        <Cover bgImage={result.poster_path ? `https://image.tmdb.org/t/p/original${result.poster_path}` : defaultPosterImg} />
                        <Data>
                            <Title>
                                <Text>{result.title ? result.title : result.name}</Text>
                                <ILink target="_blank" href={`https://www.imdb.com/title/${result.imdb_id}`}>
                                    <Img src={imdb}></Img>
                                </ILink>
                            </Title>
                            <ItemContainer>
                                <Rating>
                                    <span role="img" aria-label="rating">⭐</span>
                                    &nbsp;
                                    {result.vote_average}/10
                                </Rating>
                                <Divider>•</Divider>
                                <Item>
                                    {result.release_date ? result.release_date.substring(0, 4) : result.first_air_date.substring(0, 4)}
                                </Item>
                                {result.runtime ? <><Divider>•</Divider><Item>{result.runtime} min</Item></> : (
                                    result.episode_run_time.length > 0 ? <><Divider>•</Divider><Item>{result.episode_run_time} min</Item></> : <></>
                                )}
                                <Divider>•</Divider>
                                <Item>
                                    {result.genres && result.genres.map((genre: { name: string }, index: number) => index === result.genres.length - 1 ? genre.name : `${genre.name} / `)}
                                </Item>
                            </ItemContainer>
                            <Overview>{result.overview}</Overview>
                            <Tab>
                                <List onClick={onEvent}>
                                    <Li className='active'>
                                        Trailer
                                    </Li>
                                    {
                                        result.belongs_to_collection &&
                                        <Li>
                                            Sequels
                                        </Li>
                                    }
                                    {
                                        result.seasons && result.seasons.length > 0 &&
                                        <Li>
                                            Season
                                        </Li>
                                    }
                                    {
                                        cast && cast.length > 0 &&
                                        <Li>
                                            Credits
                                        </Li>
                                    }
                                    <Li>
                                        Production
                                    </Li>
                                </List>
                            </Tab>
                            {
                                tabName === 'Trailer' && result.videos.results && result.videos.results.length > 0 &&
                                result.videos.results.filter((video, index) => index === 0).map((video: { key: number }) => {
                                    return <Iframe
                                        key={video.key}
                                        src={`https://www.youtube.com/embed/${video.key}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Embedded youtube official trailer">
                                    </Iframe>
                                })
                            }
                            {
                                tabName === 'Trailer' && (!result.videos.results || result.videos.results.length == 0) &&
                                <Message color="#eee" text={"No Trailer Found"} />
                            }
                            {
                                tabName === 'Sequels' && result.belongs_to_collection &&
                                <Collection id={result.belongs_to_collection.id} />
                            }

                            {
                                tabName === 'Season' && result.seasons && result.seasons.length > 0 &&
                                <Box>
                                    <Section slide={false}>
                                        {result.seasons.map((season: { poster_path: string, name: string }, index: number) => (
                                            <div key={index}>
                                                <Product>
                                                    <Logo src={season.poster_path ? `https://image.tmdb.org/t/p/original${season.poster_path}` : defaultPosterImg} alt={season.name} />
                                                </Product>
                                                <Name>{season.name.length > 20 ? `${season.name.substring(0, 20)}...` : season.name}</Name>
                                            </div>
                                        ))}
                                    </Section>
                                </Box>
                            }
                            {
                                tabName === 'Credits' && cast && cast.length > 0 &&
                                <Box>
                                    <Section slide={false}>
                                        {cast.map((profile: { profile_path: string, original_name: string, character: string }, index: number) => (
                                            <div key={index}>
                                                <Product>
                                                    <Logo src={profile.profile_path ? `https://image.tmdb.org/t/p/original${profile.profile_path}` : defaultPersonImg} alt={profile.original_name} />
                                                </Product>
                                                <Name>{profile.character}</Name>
                                                <Name>({profile.original_name})</Name>
                                            </div>
                                        ))}
                                    </Section>
                                </Box>
                            }
                            {
                                tabName === 'Production' &&
                                <Box>
                                    {result.production_companies && result.production_companies.length > 0 && <Section slide={false} title="Production Companies">
                                        {result.production_companies.map((company: { id: number, logo_path: string, name: string }, index: number) =>
                                            <div key={company.id}>
                                                <Product>
                                                    <Logo logo={company.logo_path} src={company.logo_path ? `https://image.tmdb.org/t/p/original${company.logo_path}` : defaultProductionImg} alt={`${company.name}`} />
                                                </Product>
                                                <Name>{company.name.length > 17 ? `${company.name.substring(0, 17)}...` : company.name}</Name>
                                            </div>
                                        )}
                                    </Section>}
                                    {result.production_countries && result.production_countries.length > 0 && <Section slide={false} title="Production Countries">
                                        {result.production_countries.map((country: { name: string, iso_3166_1: string }, index: number) =>
                                            <div key={index}>
                                                <Flag src={`https://flagcdn.com/w160/${country.iso_3166_1.toLowerCase()}.png`} />
                                                <Name >{country.name.length > 17 ? `${country.name.substring(0, 17)}...` : country.name}</Name>
                                            </div>
                                        )}
                                    </Section>}
                                </Box>
                            }
                        </Data>
                    </Content>
                </Container>
            }
        </>
    )
}

export default Info;