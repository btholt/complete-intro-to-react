import React from 'react';
import { shape, string } from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 32%;
  border: 2px solid #333;
  margin-bottom: 25px;
  padding-right: 10px;
  overflow: hidden;
`;

const Image = styled.img`
  width:50%;
  float:left;
  margin-right;10px;


`;

const ShowCard = props => (
  <Wrapper>
    <Image alt={`${props.show.title} Show Poster`} src={`/public/img/posters/${props.show.poster}`} />
    <h1>{props.show.title}</h1>
    <h1>{props.show.year}</h1>
    <p>{props.show.description}</p>
  </Wrapper>
);

ShowCard.propTypes = {
  show: shape({
    poster: string.isRequired,
    title: string.isRequired,
    year: string.isRequired,
    description: string.isRequired
  }).isRequired
};

export default ShowCard;
