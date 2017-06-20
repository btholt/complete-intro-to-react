import React from 'react';
import { string } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled(Link)`
  width: 32%;
  border: 2px solid #333;
  border-radius: 5px;
  margin-bottom: 25px;
  padding-right: 10px;
  overflow: hidden;
  text-decoration: none;
  color: black;
`;

const Image = styled.img`
  width: 46%;
  float: left;
  margin-right: 10px;
`;

const ShowCard = props =>
  <Wrapper to={`/details/${props.imdbID}`} className="show-card">
    <Image src={`/public/img/posters/${props.poster}`} alt={`${props.title} show poster`} />
    <div>
      <h3>{props.title}</h3>
      <h4>({props.year})</h4>
      <p>{props.description}</p>
    </div>
  </Wrapper>;

ShowCard.propTypes = {
  poster: string.isRequired,
  title: string.isRequired,
  year: string.isRequired,
  description: string.isRequired,
  imdbID: string.isRequired
};

export default ShowCard;
