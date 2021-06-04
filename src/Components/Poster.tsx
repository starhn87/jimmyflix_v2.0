import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import defaultImg from "../assets/images/noPosterSmall.png";

const Container = styled.div`
    font-size: 12px;
`;

const Image = styled.div<{ bgUrl: string }>`
    height: 180px;
    background-image: url(${props => props.bgUrl});
    background-size: cover;
    border-radius: 4px;
    background-position: center center;
    transition: opacity 0.1s linear;
`;

const Rating = styled.span`
    position: absolute;
    bottom: 5px;
    right: 5px;
    opacity: 0;
    transition: opacity 0.1s linear;
`;

const ImageContainer = styled.div`
    position: relative;
    margin-bottom: 5px;
    &:hover {
        ${Image} {
            opacity: 0.3;
        }
        ${Rating} {
            opacity: 1;
        }
    }
`;

const Title = styled.span`
    display: block;
    margin-bottom: 3px;
`;

const Year = styled.span`
    font-size: 10px;
    color: rgba(255, 255, 255, 0.5);
`;

interface Props {
    id: number,
    imageUrl: string,
    title: string,
    rating: number,
    year: string
    isMovie?: boolean
}

const Poster: React.FunctionComponent<Props> = ({ id, imageUrl, title, rating, year, isMovie = false }) => (
    <Link to={isMovie ? `/movie/${id}` : `/show/${id}`}>
        <Container>
            <ImageContainer>
                <Image bgUrl={imageUrl ? `https://image.tmdb.org/t/p/w300${imageUrl}` : defaultImg} />
                <Rating>
                    <span role="img" aria-label="rating">⭐</span>
                    {" "}
                    {rating}/10
                </Rating>
            </ImageContainer>
            <Title>{title.length > 15 ? `${title.substring(0, 15)}...` : title}</Title>
            <Year>{year}</Year>
        </Container>
    </Link>
)

export default Poster;