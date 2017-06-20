import React from 'react';
import { string } from 'prop-types';
import axios from 'axios';
import Header from './Header';
import Spinner from './Spinner';

class Details extends React.Component {
  static propTypes = {
    title: string.isRequired,
    description: string.isRequired,
    poster: string.isRequired,
    trailer: string.isRequired,
    year: string.isRequired,
    imdbID: string.isRequired
  };
  state = {
    apiData: {}
  };
  componentDidMount() {
    axios.get(`http://localhost:3000/${this.props.imdbID}`).then(response => {
      this.setState({ apiData: response.data });
    });
  }
  render() {
    let rating;
    if (this.state.apiData.rating) {
      rating = <h3>{this.state.apiData.rating}</h3>;
    } else {
      rating = <Spinner />;
    }
    const { title, year, poster, description, trailer } = this.props;
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
            src={`https://www.youtube-nocookie.com/embed/${trailer}?rel=0&amp;showinfo=0&amp;controls=0`}
            frameBorder="0"
            allowFullScreen
            title={`Trailer for ${title}`}
          />
        </div>
      </div>
    );
  }
}

export default Details;
