// @flow

import React from 'react';
import axios from 'axios';
import Header from './Header';
import Spinner from './Spinner';

class Details extends React.Component {
  state = {
    omdbData: { imdbRating: '' }
  };
  componentDidMount() {
    axios
      .get(`http://www.omdbapi.com/?i=${this.props.show.imdbID}`)
      .then((response: { data: { imdbRating: string } }) => {
        this.setState({ omdbData: response.data });
      });
  }
  props: {
    show: Show
  };
  render() {
    const { title, description, year, poster, trailer } = this.props.show;
    let rating;
    if (this.state.omdbData.imdbRating) {
      rating = <h3>{this.state.omdbData.imdbRating}</h3>;
    } else {
      rating = <Spinner />;
    }
    return (
      <div className="details">
        <Header />
        <section>
          <h1>{title}</h1>
          <h2>({year})</h2>
          {rating}
          <img src={`/public/img/posters/${poster}`} alt={`Poster for ${title}`} />
          <p>{description}</p>
        </section>
        <div>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailer}?rel=0&amp;controls=0&amp;showinfo=0`}
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>
    );
  }
}

export default Details;
