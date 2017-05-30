import React from 'react';

const ShowCard = props => (
  <div className="show-card">
    <img alt={`${props.show.title} Show Poster`} src={`/public/img/posters/${props.show.poster}`} />
    <div>
      <h3>{props.show.title}</h3>
      <h4>({props.show.year})</h4>
      <p>{props.show.description}</p>
    </div>
  </div>
);

export default ShowCard;
