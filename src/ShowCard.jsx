import React from 'react';
import { string } from 'prop-types';

const ShowCard = props =>
  <div className="show-card">
    <img src={`/public/img/posters/${props.poster}`} alt={`${props.title} show poster`} />
    <div>
      <h3>{props.title}</h3>
      <h4>({props.year})</h4>
      <p>{props.description}</p>
    </div>
  </div>;

ShowCard.propTypes = {
  poster: string.isRequired,
  title: string.isRequired,
  year: string.isRequired,
  description: string.isRequired
};

export default ShowCard;
