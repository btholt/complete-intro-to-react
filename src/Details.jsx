import React from 'react';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import { getAPIDetails } from './actionCreators';
import Header from './Header';
import Spinner from './Spinner';

class Details extends React.Component {
  static propTypes = {
    title: string.isRequired,
    description: string.isRequired,
    poster: string.isRequired,
    trailer: string.isRequired,
    year: string.isRequired,
    imdbID: string.isRequired, // eslint-disable-line react/no-unused-prop-types
    rating: string.isRequired,
    getAPIData: func.isRequired
  };
  componentDidMount() {
    if (!this.props.rating) {
      this.props.getAPIData();
    }
  }
  render() {
    const { title, year, poster, description, trailer, rating } = this.props;
    let ratingDisplay;
    if (rating) {
      ratingDisplay = <h3>{rating}</h3>;
    } else {
      ratingDisplay = <Spinner />;
    }
    return (
      <div className="details">
        <Header />
        <section>
          <h1>{title}</h1>
          <h2>({year})</h2>
          {ratingDisplay}
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

const mapStateToProps = (state, ownProps) => {
  const rating = state.apiData[ownProps.imdbID] ? state.apiData[ownProps.imdbID].rating : '';
  return { rating };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  getAPIData() {
    dispatch(getAPIDetails(ownProps.imdbID));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Details);
