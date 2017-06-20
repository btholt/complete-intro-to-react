import React from 'react';
import { string } from 'prop-types';

const Details = props =>
  <div className="details">
    <header>
      <h1>svideo</h1>
    </header>
    <section>
      <h1>{props.title}</h1>
      <h2>({props.year})</h2>
      <img src={`/public/img/posters/${props.poster}`} alt={`Poster for ${props.title}`} />
      <p>{props.description}</p>
    </section>
    <div>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${props.trailer}?rel=0&amp;showinfo=0&amp;controls=0`}
        frameBorder="0"
        allowFullScreen
        title={`Trailer for ${props.title}`}
      />
    </div>
  </div>;

Details.propTypes = {
  title: string.isRequired,
  description: string.isRequired,
  poster: string.isRequired,
  trailer: string.isRequired,
  year: string.isRequired
};

export default Details;
