// @flow
import React from 'react';
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

const ShowCard = (props: { poster: string, title: string, year: string, description: string }) => (
  <Wrapper>
    <Image alt={`${props.title} Show Poster`} src={`/public/img/posters/${props.poster}`} />
    <h1>{props.title}</h1>
    <h1>{props.year}</h1>
    <p>{props.description}</p>
  </Wrapper>
);

export default ShowCard;
